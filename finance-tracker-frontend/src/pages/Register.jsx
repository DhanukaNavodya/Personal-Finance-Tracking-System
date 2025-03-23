import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
  const [username, setUsername] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // Default role: USER
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // ✅ Success message
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        contactNumber,
        email,
        password,
        role,
      });

      setMessage(response.data.message); // ✅ Display success message
      console.log("✅ Registration successful:", response.data);
      
      navigate("/login"); // Redirect to login after successful registration

    } catch (err) {
      console.error("❌ Registration failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Register</h2>

      {error && <p className="alert alert-danger">{error}</p>}
      {message && <p className="alert alert-success">{message}</p>}

      <form onSubmit={handleRegister} className="shadow p-4 rounded border">
        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Contact Number" 
            value={contactNumber} 
            onChange={(e) => setContactNumber(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <input 
            type="email" 
            className="form-control" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <input 
            type="password" 
            className="form-control" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <select 
            className="form-select" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
    </div>
  );
};

export default Register;
