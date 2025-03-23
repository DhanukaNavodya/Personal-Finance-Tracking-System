import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      login(user, token);
      toast.success("Login successful!");
      
      // Redirect based on role
      if (user.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password");
      toast.error("Invalid email or password");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary w-100">Login</button>
          </div>

          <div className="mt-3 text-center">
            <small>
              Don't have an account? <a href="/register" className="text-decoration-none">Sign up</a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;