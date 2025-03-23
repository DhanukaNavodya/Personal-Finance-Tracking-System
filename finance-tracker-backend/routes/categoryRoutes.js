import express from 'express';
import { addCategory, getCategories, deleteCategory } from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only admins can add or delete categories
router.post('/', protect, adminOnly, addCategory);
router.get('/', protect, getCategories);
router.delete('/:id', protect, adminOnly, deleteCategory);

export default router;
