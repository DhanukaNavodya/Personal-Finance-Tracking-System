import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateExpense = () => {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [categories, setCategories] = useState([]); // New state for categories
    const [message, setMessage] = useState("");
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }

        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/categories", {
                    headers: { Authorization: `Bearer ${storedToken}` }
                });
                setCategories(response.data);
            } catch (error) {
                console.error("🚨 Error fetching categories:", error.response?.data || error.message);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            setMessage("User not authenticated! Please log in.");
            console.error("🚨 No token found. Redirecting to login...");
            navigate("/login");
            return;
        }
        console.log("🔑 Sending token:", token);

        const expenseData = {
            amount: parseFloat(amount),
            category,
            description,
            tag,
            date: new Date().toISOString(),
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/api/expenses",
                expenseData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("✅ Expense added successfully!");
            console.log("✅ Response:", response.data);

            setAmount("");
            setCategory("");
            setDescription("");
            setTag("");
        } catch (err) {
            if (err.response?.status === 403) {
                setMessage("❌ Access Denied! Please log in again.");
                console.error("🚨 Forbidden: Token expired or invalid");
            } else {
                setMessage("❌ Error adding expense");
                console.error("🚨 Error:", err.response ? err.response.data : err.message);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Create Expense</h2>

            {message && (
                <div className={`alert ${message.includes("Error") ? "alert-danger" : "alert-success"}`} role="alert">
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="p-4 border rounded shadow bg-light">
                <div className="mb-3">
                    <label className="form-label">Amount</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

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
                    <label className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tag</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., #Vacation, #Work"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Add Expense</button>
            </form>
        </div>
    );
};

export default CreateExpense;
