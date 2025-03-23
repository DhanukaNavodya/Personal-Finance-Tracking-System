import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// Create a new budget
export const addBudget = async (req, res) => {
  try {
    const { category, amount, endDate } = req.body;

    const budget = new Budget({
      userId: req.user.id,
      category,
      amount,
      spent: 0,
      endDate
    });

    await budget.save();
    res.status(201).json({ message: 'Budget created successfully', budget });

  } catch (error) {
    res.status(500).json({ message: `Failed to create budget: ${error.message}` });
  }
};

// Get all budgets for a user
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.id }).sort({ endDate: -1 });
    res.status(200).json(budgets);

  } catch (error) {
    res.status(500).json({ message: `Failed to fetch budgets: ${error.message}` });
  }
};

// Update a budget
export const updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    Object.assign(budget, req.body);
    await budget.save();

    res.status(200).json({ message: 'Budget updated successfully', budget });

  } catch (error) {
    res.status(500).json({ message: `Failed to update budget: ${error.message}` });
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    await Budget.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Budget deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: `Failed to delete budget: ${error.message}` });
  }
};



// Get a single budget by ID
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget || budget.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ message: `Error fetching budget: ${error.message}` });
  }
};

export const checkBudgetStatus = async (req, res) => {
  try {
    const { category } = req.params;
    const budget = await Budget.findOne({ userId: req.user.id, category });

    if (!budget) {
      return res.status(404).json({ message: 'No budget found for this category' });
    }

    let status = 'Within budget';
    if (budget.spent >= budget.amount) {
      status = 'Exceeded budget!';
    } else if (budget.spent >= budget.amount * 0.8) {
      status = 'Warning: Nearing budget limit';
    }

    res.status(200).json({ budget, status });

  } catch (error) {
    res.status(500).json({ message: `Error checking budget status: ${error.message}` });
  }
};


// Get Budget Plan for Current Date
export const getCurrentBudgetPlan = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user authentication middleware is used
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    // Find budget plans where today falls within the start and end date
    const currentBudget = await Budget.find({
      userId,
      startDate: { $lte: today },
      endDate: { $gte: today }
    });

    if (currentBudget.length === 0) {
      return res.status(404).json({ message: 'No active budget plan for today' });
    }

    res.status(200).json({ budgets: currentBudget });

  } catch (error) {
    res.status(500).json({ message: `Error fetching current budget plan: ${error.message}` });
  }
};
