import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from local storage
        const response = await axios.get("http://localhost:5000/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` }, // Send token for authentication
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">User List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Contact Number</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.contactNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
