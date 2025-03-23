import Income from '../models/Income.js';
import mongoose from "mongoose";
import Goal from "../models/Goal.js";
import User from "../models/User.js";

export const addIncome = async (req, res) => {
  const { amount, source, description, goalId, tags, isRecurring, recurrencePattern } = req.body;

  try {
      // 1. Create and save the new income record
      const income = new Income({
          userId: req.user.id,
          amount,
          source,
          description,
          goalId, // Optional
          tags,
          isRecurring,
          recurrencePattern,
      });

      await income.save();

      let allocatedAmount = 0;

      // 2. If the income is linked to a goal, allocate savings
      if (goalId) {
          const goal = await Goal.findById(goalId);

          if (!goal) {
              return res.status(404).json({ message: "Goal not found" });
          }

          // Get the goal's savings allocation percentage
          const savingsAllocationPercentage = goal.savingsAllocationPercentage || 10; // Default to 10% if not set
          console.log(savingsAllocationPercentage);
          // Calculate savings amount from income
          allocatedAmount = (savingsAllocationPercentage / 100) * amount;
          console.log(allocatedAmount);

          // Ensure allocated amount does not exceed targetAmount
          const newCurrentAmount = goal.currentAmount + allocatedAmount;
          if (newCurrentAmount > goal.targetAmount) {
              allocatedAmount = goal.targetAmount - goal.currentAmount;
          }

          // Update the goal's `currentAmount`
          goal.currentAmount += allocatedAmount;
          await goal.save();
      }

      res.status(201).json({
          message: "Income created successfully",
          income,
          allocatedToGoal: allocatedAmount,
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


// Get all incomes for logged-in user
export const getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(incomes);

  } catch (error) {
    res.status(500).json({ message: `Failed to fetch incomes: ${error.message}` });
  }
};

// Get a single income by ID
export const getIncomeById = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income || income.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.status(200).json(income);
  } catch (error) {
    res.status(500).json({ message: `Error fetching income: ${error.message}` });
  }
};

// Update an income
export const updateIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income || income.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Income not found' });
    }

    Object.assign(income, req.body);
    await income.save();

    res.status(200).json({ message: 'Income updated successfully', income });

  } catch (error) {
    res.status(500).json({ message: `Failed to update income: ${error.message}` });
  }
};

// Delete an income
export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);

    if (!income || income.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Use deleteOne()
    await Income.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Income deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: `Failed to delete income: ${error.message}` });
  }
};

// export const getTotalIncome = async (req, res) => {
//   try {
//     // Get the user ID from the request params
//     const { userId } = req.params; 

//     // Ensure the userId is treated as ObjectId
//     const objectId = mongoose.Types.ObjectId(userId);

//     // Aggregate the sum of all income amounts for the provided userId
//     const totalIncome = await Income.aggregate([
//       { $match: { userId: objectId } }, // Match incomes for the provided user
//       { $group: { _id: null, total: { $sum: "$amount" } } } // Sum up all the 'amount' fields
//     ]);

//     if (!totalIncome || totalIncome.length === 0) {
//       return res.status(404).json({ message: 'No incomes found for the user' });
//     }

//     res.status(200).json({ totalIncome: totalIncome[0].total });

//   } catch (error) {
//     res.status(500).json({ message: `Failed to calculate total income: ${error.message}` });
//   }
// };


export const getTotalIncomeByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params

    // Validate if the provided userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Aggregate total income for the given user ID
    const totalIncome = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match incomes for user
      { $group: { _id: null, total: { $sum: "$amount" } } } // Sum up all amounts
    ]);

    // If no income is found, return 0
    const incomeValue = totalIncome.length ? totalIncome[0].total : 0;

    res.status(200).json({ totalIncome: incomeValue });

  } catch (error) {
    res.status(500).json({ message: `Failed to calculate total income: ${error.message}` });
  }
};

export const getIncomeOverTime = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Group income by month
    const incomeData = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: {
          _id: { $month: "$date" }, // Group by month
          totalIncome: { $sum: "$amount" },
        }
      },
      { $sort: { "_id": 1 } } // Sort by month (ascending)
    ]);

    // Ensure all 12 months are present, filling missing months with 0 totalIncome
    const formattedData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalIncome: incomeData.find(item => item._id === i + 1)?.totalIncome || 0
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch income over time: ${error.message}` });
  }
};
