import express from "express";
import { createGoal, getGoals, updateGoal, deleteGoal,getGoalById } from "../controllers/goalController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protect, createGoal);
router.get("/", protect, getGoals);
router.put("/:id",protect,  updateGoal);
router.delete("/:id",protect, deleteGoal);
router.get("/:id",protect, getGoalById);

export default router;
