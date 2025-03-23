import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal", default: null }, // Link to a specific goal (optional)
    source: { type: String, required: true }, // e.g., Salary, Freelance, Investments
    amount: { type: Number, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    tags: [{ type: String }], // Custom labels like #salary, #bonus
    isRecurring: { type: Boolean, default: false }, // Recurring income (salary, etc.)
    recurrencePattern: { type: String, enum: ["daily", "weekly", "monthly"], default: null },
  },
  { timestamps: true }
);

const Income = mongoose.model("Income", IncomeSchema);
export default Income;
