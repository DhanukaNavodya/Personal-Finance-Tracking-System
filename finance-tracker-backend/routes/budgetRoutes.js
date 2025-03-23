import express from 'express';
import { addBudget, getBudgets, updateBudget, deleteBudget, checkBudgetStatus,getBudgetById,getCurrentBudgetPlan } from '../controllers/budgetController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addBudget);
router.get('/', protect, getBudgets);
router.put('/:id', protect, updateBudget);
router.delete('/:id', protect, deleteBudget);
router.get('/status/:category', protect, checkBudgetStatus);
router.get('/:id', protect, getBudgetById);
router.get('/date/current', protect, getCurrentBudgetPlan);

export default router;
