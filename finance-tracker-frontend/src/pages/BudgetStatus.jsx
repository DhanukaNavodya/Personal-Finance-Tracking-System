import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BudgetStatus = () => {
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState(null);

    const checkBudget = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/budgets/status/${category}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            setStatus(response.data);
        } catch (error) {
            toast.error("Error checking budget status!");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Check Budget Status</h2>

            <div className="mb-3">
                <label className="form-label">Category</label>
                <input
                    type="text"
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
            </div>

            <button className="btn btn-primary w-100" onClick={checkBudget}>Check Status</button>

            {status && (
                <div className="alert mt-3 alert-info">
                    <h4>Budget Status for {category}</h4>
                    <p><strong>Status:</strong> {status.status}</p>
                    <p><strong>Spent:</strong> ${status.budget.spent} / ${status.budget.amount}</p>
                </div>
            )}
        </div>
    );
};

export default BudgetStatus;
