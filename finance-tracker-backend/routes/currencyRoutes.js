import express from "express";
import { setUserCurrency, getUserCurrency,convertCurrency } from "../controllers/currencyController.js";
import { getConvertedExpenses } from "../controllers/expenseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/set", protect, setUserCurrency);
router.get("/get", protect, getUserCurrency);
router.get("/expenses", protect, getConvertedExpenses);
router.post("/convert", convertCurrency);

export default router;
