import express from "express";
import { sendEmailController } from "../controllers/emailController.js";

const router = express.Router();

// Call this route to send an email
router.post("/send", sendEmailController);

export default router;
