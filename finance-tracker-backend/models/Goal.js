import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    savingsAllocationPercentage: { 
      type: Number, 
      default: 0,  // Default: 0% if not set
      min: 0, 
      max: 100 
    },
    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress"
    }
  },
  { timestamps: true }
);

// Auto-update status when currentAmount changes
GoalSchema.pre("save", function (next) {
  this.status = this.currentAmount >= this.targetAmount ? "Completed" : "In Progress";
  next();
});

const Goal = mongoose.model("Goal", GoalSchema);
export default Goal;
