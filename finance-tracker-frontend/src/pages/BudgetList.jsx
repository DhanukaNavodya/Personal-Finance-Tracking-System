import React, { useState, useEffect } from "react";
import axios from "axios";
import BudgetForm from "./BudgetForm";
import { toast } from "react-toastify";

const BudgetList = () => {
    const [budgets, setBudgets] = useState([]);
    const [editingBudget, setEditingBudget] = useState(null);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/budgets", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setBudgets(response.data);
        } catch (error) {
            toast.error("Error fetching budgets!");
        }
    };

    const deleteBudget = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/budgets/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            toast.success("Budget deleted successfully!");
            fetchBudgets();
        } catch (error) {
            toast.error("Error deleting budget!");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Manage Budgets</h2>

            {editingBudget ? (
                <BudgetForm budget={editingBudget} onSuccess={() => {
                    setEditingBudget(null);
                    fetchBudgets();
                }} />
            ) : (
                <BudgetForm onSuccess={fetchBudgets} />
            )}

            <h3 className="mt-4">Your Budgets</h3>
            <ul className="list-group">
                {budgets.map((budget) => (
                    <li key={budget._id} className="list-group-item d-flex justify-content-between">
                        <span>
                            <strong>{budget.category}</strong>: ${budget.amount} (Spent: ${budget.spent})
                        </span>
                        <div>
                            <button className="btn btn-sm btn-warning me-2" onClick={() => setEditingBudget(budget)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => deleteBudget(budget._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BudgetList;
