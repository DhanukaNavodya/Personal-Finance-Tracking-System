import express from 'express';
import { addExpense, getExpenses, getExpenseById, updateExpense, deleteExpense ,getConvertedExpenses,getTotalExpenseByUserId,getExpenseOverTime,getExpensesByRecurrencePattern,getAllRecurringExpenses} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRUD Operations for Expenses
router.post('/', protect, addExpense);
router.get('/', protect, getExpenses);
router.get('/:id', protect, getExpenseById);
router.put('/:id', protect, updateExpense);
router.delete('/:id', protect, deleteExpense);
router.get("/user/:userId", getTotalExpenseByUserId);
router.get("/user/expence-over-time/:userId",protect, getExpenseOverTime);
router.get("/recurring/all", protect, getAllRecurringExpenses); // Place this first
router.get("/recurring/pattern", protect, getExpensesByRecurrencePattern);
router.get("/exp/covertedExpence", protect, getConvertedExpenses);

export default router;
