import express from 'express';
import { addIncome, getIncomes, getIncomeById, updateIncome, deleteIncome,getTotalIncomeByUserId,getIncomeOverTime   } from '../controllers/incomeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRUD Operations for Income
router.post('/', protect, addIncome);
router.get('/', protect, getIncomes);
router.get('/:id', protect, getIncomeById);
router.put('/:id', protect, updateIncome);
router.delete('/:id', protect, deleteIncome);
router.get("/user/:userId",protect, getTotalIncomeByUserId);
router.get("/user/income-over-time/:userId",protect, getIncomeOverTime);
export default router;
