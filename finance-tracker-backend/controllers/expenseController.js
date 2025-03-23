import Expense from '../models/Expense.js';
import mongoose from "mongoose";
import Budget from '../models/Budget.js';
import Currency from "../models/Currency.js";
import { getExchangeRates } from "../utils/exchangeRates.js";
import { sendBudgetExceededEmail } from "../utils/emailService.js";
// Create a new expense & update budget
export const addExpense = async (req, res) => {
  try {
    const { budgetId, category, amount, description, date, tags, isRecurring, recurrencePattern } = req.body;

    // Find the corresponding budget
    const budget = await Budget.findById(budgetId);
    if (!budget || budget.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Create expense
    const expense = new Expense({
      userId: req.user.id,
      budgetId,
      category,
      amount,
      description,
      date,
      tags,
      isRecurring,
      recurrencePattern
    });

    await expense.save();

    // Update budget spent & remaining
    budget.spent += amount;
    budget.remaining = budget.amount - budget.spent;
    budget.expenseIds.push(expense._id);
    await budget.save();

    if (budget.spent > budget.amount) {
      const user = req.user; // Assuming you have user details in `req.user`
      if (user.email) {
        await sendBudgetExceededEmail(user.email, budget.category, budget.spent, budget.amount);
      }
    }

    res.status(201).json({ message: 'Expense added successfully', expense });

  } catch (error) {
    res.status(500).json({ message: `Failed to add expense: ${error.message}` });
  }
};


// Get all expenses for logged-in user
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);

  } catch (error) {
    res.status(500).json({ message: `Failed to fetch expenses: ${error.message}` });
  }
};

// Get a single expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense || expense.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({ message: `Error fetching expense: ${error.message}` });
  }
};

// Update an expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense || expense.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    Object.assign(expense, req.body);
    await expense.save();

    res.status(200).json({ message: 'Expense updated successfully', expense });

  } catch (error) {
    res.status(500).json({ message: `Failed to update expense: ${error.message}` });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Find the linked budget
    const budget = await Budget.findById(expense.budgetId);
    if (budget) {
      budget.spent -= expense.amount;
      budget.remaining = budget.amount - budget.spent;
      budget.expenseIds = budget.expenseIds.filter(id => id.toString() !== req.params.id);
      await budget.save();
    }

    await Expense.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Expense deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: `Failed to delete expense: ${error.message}` });
  }
};


export const getTotalExpenseByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL params

    // Validate if the provided userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Aggregate total expense for the given user ID
    const totalExpense = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } }, // Match expenses for user
      { $group: { _id: null, total: { $sum: "$amount" } } } // Sum up all amounts
    ]);

    // If no expense is found, return 0
    const expenseValue = totalExpense.length ? totalExpense[0].total : 0;

    res.status(200).json({ totalExpense: expenseValue });

  } catch (error) {
    res.status(500).json({ message: `Failed to calculate total expense: ${error.message}` });
  }
};

export const getExpenseOverTime = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Group expenses by month
    const expenseData = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: {
          _id: { $month: "$date" }, // Group by month
          totalExpense: { $sum: "$amount" },
        }
      },
      { $sort: { "_id": 1 } } // Sort by month (ascending)
    ]);

    // Ensure all 12 months are present, filling missing months with 0 totalExpense
    const formattedData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalExpense: expenseData.find(item => item._id === i + 1)?.totalExpense || 0
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch expense over time: ${error.message}` });
  }
};

export const getAllRecurringExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ isRecurring: true }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch recurring expenses: ${error.message}` });
  }
};

export const getExpensesByRecurrencePattern = async (req, res) => {
  try {
    const { pattern } = req.query;

    if (!pattern || !["daily", "weekly", "monthly"].includes(pattern.toLowerCase())) {
      return res.status(400).json({ message: "Invalid recurrence pattern. Use 'daily', 'weekly', or 'monthly'." });
    }

    const expenses = await Expense.find({
      isRecurring: true,
      recurrencePattern: pattern.toLowerCase()
    }).sort({ date: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: `Failed to fetch expenses: ${error.message}` });
  }
};



// Get all expenses and convert to user's preferred currency
export const getConvertedExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userCurrency = await Currency.findOne({ userId });

    if (!userCurrency) {
      return res.status(400).json({ message: "Currency preference not set" });
    }

    const expenses = await Expense.find({ userId });

    // Fetch exchange rates
    const exchangeRates = await getExchangeRates("USD"); // Assuming stored expenses in USD
    const conversionRate = exchangeRates[userCurrency.baseCurrency] || 1;

    // Convert all expenses to user's currency
    const convertedExpenses = expenses.map(expense => ({
      ...expense.toObject(),
      convertedAmount: (expense.amount * conversionRate).toFixed(2),
      currency: userCurrency.baseCurrency
    }));

    res.status(200).json(convertedExpenses);
  } catch (error) {
    res.status(500).json({ message: `Error converting expenses: ${error.message}` });
  }
};