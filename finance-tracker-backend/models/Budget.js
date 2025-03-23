import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  spent: { type: Number, default: 0 }, // Total spent
  remaining: { type: Number, default: function () { return this.amount; } },
  startDate: { type: Date, default: new Date() },
  endDate: { type: Date, required: true },
  notificationsEnabled: { type: Boolean, default: true },
  expenseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }] // Linked expenses
}, { timestamps: true });

const Budget = mongoose.model('Budget', BudgetSchema);
export default Budget;
