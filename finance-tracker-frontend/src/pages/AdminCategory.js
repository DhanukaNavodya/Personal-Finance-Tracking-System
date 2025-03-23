import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminCategory = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [message, setMessage] = useState("");

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/categories", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/categories",
                { name: newCategory },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            setMessage(response.data.message);
            setNewCategory("");
            fetchCategories();
        } catch (error) {
            setMessage(error.response?.data?.message || "Error adding category");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Manage Categories</h2>

            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleAddCategory} className="p-3 border shadow bg-light">
                <div className="mb-3">
                    <label className="form-label">New Category Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter category name"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Add Category</button>
            </form>

            <h3 className="mt-4">Existing Categories</h3>
            <ul className="list-group">
                {categories.map((cat) => (
                    <li key={cat._id} className="list-group-item d-flex justify-content-between">
                        {cat.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminCategory;
