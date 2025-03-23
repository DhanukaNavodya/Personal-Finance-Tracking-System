import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from './context/UserContext'; // Adjust the path as necessary
import Navbar from "./component/Navbar"; // Adjust the path as necessary
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateExpense from "./pages/CreateExpense";
import Profile from "./pages/profile";
import AdminCategory from "./pages/AdminCategory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BudgetList from "./pages/BudgetList";
import BudgetStatus from "./pages/BudgetStatus";
import UserList from "./pages/UserList";
import UserEnrollmentChart from "./component/UserEnrollmentChart"; // Import the chart

function App() {
  return (
    <UserProvider> {/* Wrap the app with UserProvider */}
      <Router>
      <ToastContainer />
        <div className="d-flex  h-ful"> {/* Bootstrap Flexbox to manage full height and horizontal layout */}
          {/* The Navbar will be displayed on all pages */}
          <Navbar />
          
          <div className="w-100"> {/* Bootstrap class to make the content area full width */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-expense" element={<CreateExpense />} />
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/category" element={<AdminCategory/>}/>
              <Route path="/budget" element={<BudgetList />} />  {/* Default route */}
              <Route path="/status" element={<BudgetStatus />} />  {/* Budget status route */}
              <Route path="/users" element={<UserList />} /> 
              <Route path="/user-enrollment" element={<UserEnrollmentChart />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
