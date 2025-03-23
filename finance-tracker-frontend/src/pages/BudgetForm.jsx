import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BudgetForm = ({ budget, onSuccess }) => {
    const [category, setCategory] = useState(budget?.category || "");
    const [amount, setAmount] = useState(budget?.amount || "");
    const [endDate, setEndDate] = useState(budget?.endDate || "");
    const [categories, setCategories] = useState([]); // State for categories

    useEffect(() => {
        if (budget) {
            setCategory(budget.category);
            setAmount(budget.amount);
            setEndDate(budget.endDate);
        }

        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/categories", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCategories(response.data);
            } catch (error) {
                console.error("🚨 Error fetching categories:", error.response?.data || error.message);
            }
        };

        fetchCategories();
    }, [budget]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { category, amount, endDate };

        try {
            const token = localStorage.getItem("token");
            if (budget) {
                await axios.put(`http://localhost:5000/api/budgets/${budget._id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Budget updated successfully!");
            } else {
                await axios.post("http://localhost:5000/api/budgets", data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Budget created successfully!");
            }
            onSuccess();
        } catch (error) {
            toast.error("Error saving budget!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-light">
            <div className="mb-3">
                <label className="form-label">Category</label>
                <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">End Date</label>
                <input
                    type="date"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">
                {budget ? "Update Budget" : "Create Budget"}
            </button>
        </form>
    );
};

export default BudgetForm;
