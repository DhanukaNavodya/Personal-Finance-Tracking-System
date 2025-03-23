import express from 'express';
import { signup, login ,getAllUsers,getUserEnrollmentStats,getUserById} from '../controllers/authController.js';
import { protect,adminOnly } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/users',protect,adminOnly,getAllUsers);
router.get("/enrollment-stats", protect,adminOnly,getUserEnrollmentStats); // Only admins can access
router.get("/:id", protect,adminOnly,getUserById);

export default router;
