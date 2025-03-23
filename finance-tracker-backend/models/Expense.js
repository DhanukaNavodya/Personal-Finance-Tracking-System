import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget', required: true }, // Link to budget
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  tags: [{ type: String }],
  isRecurring: { type: Boolean, default: false },
  recurrencePattern: { type: String, enum: ['daily', 'weekly', 'monthly'], default: null }
}, { timestamps: true });

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;
