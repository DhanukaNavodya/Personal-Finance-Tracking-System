import Category from "../models/Category.js";

// Create a new category (Admin only)
export const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) return res.status(400).json({ message: "Category already exists" });

    const newCategory = new Category({
      name,
      createdBy: req.user.id, // Admin ID from the authenticated user
    });

    await newCategory.save();
    res.status(201).json({ message: "Category added successfully", category: newCategory });

  } catch (error) {
    res.status(500).json({ message: "Error adding category", error: error.message });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("createdBy", "username email");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// Delete a category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted successfully" });

  } catch (error) {
    res.status(404).json({ message: "Error deleting category", error: error.message });
  }
};
