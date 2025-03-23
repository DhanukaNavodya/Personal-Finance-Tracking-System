import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext"; // Import useUser to access context
import { FaUserCircle } from "react-icons/fa"; // Importing React Icon for the profile

const Navbar = () => {
  const { isLoggedIn, logout } = useUser(); // Get login state and user info from context
  const navigate = useNavigate();

  // Retrieve user details from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    logout(); // Call logout from context
    localStorage.removeItem("user"); // Remove user data from localStorage
    localStorage.removeItem("token"); // Optionally, remove token from localStorage
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="d-flex">
      <div
        className="d-flex flex-column bg-dark text-white p-3"
        style={{ height: "100vh", width: "250px" }}
      >
        {/* Profile Section at the Top of Navbar */}
        <div className="d-flex justify-content-center align-items-center mb-4">
          <Link to="/profile">
            <FaUserCircle
              style={{
                fontSize: "3rem",
                color: "white",
                cursor: "pointer",
              }}
            />
          </Link>
          
        </div>
        {/* <center><h6 style={{marginBottom:"10px"}}>Wellcome {user.username}</h6></center> */}

        {/* Welcome Message */}
        {isLoggedIn && user && user.name && (
          <div className="text-center mb-4 text-white">
            <h5>Welcome, {user.name}</h5>
          </div>
        )}

        {/* Navbar Links */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/create-expense">
              Create Expense
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link text-white" to="/category">
              Category
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/budget">
              Budget
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/users">
              Users
            </Link>
          </li>
          
          {isLoggedIn && (
            <>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/dashboard">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li className="nav-item">
              <Link className="nav-link text-white" to="/login">
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="content flex-grow-1 p-4">
        {/* Your main content goes here */}
      </div>
    </div>
  );
};

export default Navbar;
