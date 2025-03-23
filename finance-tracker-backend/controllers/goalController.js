import Goal from "../models/Goal.js";

export const createGoal = async (req, res) => {
    const { title, description, targetAmount, currentAmount, deadline, savingsAllocationPercentage } = req.body;
    try {
        if (savingsAllocationPercentage < 0 || savingsAllocationPercentage > 100) {
            return res.status(400).json({ message: "Savings allocation percentage must be between 0 and 100" });
        }

        const goal = new Goal({
            user: req.user.id,
            title,
            description,
            targetAmount,
            currentAmount,
            deadline,
            savingsAllocationPercentage
        });
        await goal.save();
        res.status(201).json(goal);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Use findByIdAndDelete() instead of .remove()
    await Goal.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Goal removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getGoalById = async (req, res) => {
    try {
      const goal = await Goal.findById(req.params.id);
  
      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }
  
      if (goal.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      res.json(goal);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  