import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import IncomeChart from "../component/IncomeChart"; // Adjust the path
import ExpenceChart from "../component/expenceChart"; // Adjust the path

const Home = () => {
  const [totalIncome, setTotalIncome] = useState(null);
  const [totalExpence, setTotalExpence] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUserInfo = localStorage.getItem("user");

    if (!token || !storedUserInfo) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUserInfo);

    // Fetch total income
    const fetchTotalIncome = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const incomeResponse = await axios.get(`http://localhost:5000/api/incomes/user/${parsedUser.id}`, { headers });
        console.log("Total Income Response:", incomeResponse.data);
        setTotalIncome(incomeResponse.data.totalIncome);  // Access totalIncome from response.data
      } catch (err) {
        console.error("Failed to fetch total income:", err);
      }
    };

    // Fetch total expense
    const fetchTotalExpence = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const expenceResponse = await axios.get(`http://localhost:5000/api/expenses/user/${parsedUser.id}`, { headers });
        console.log("Total Expense Response:", expenceResponse.data);
        setTotalExpence(expenceResponse.data.totalExpense);  // Access totalExpense from response.data
      } catch (err) {
        console.error("Failed to fetch total expense:", err);
      }
    };

    fetchTotalIncome();
    fetchTotalExpence();
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h2 className="text-center">Personal Finance Dashboard</h2>
      <div className="d-flex justify-content-between">
        {/* Card 1 */}
        <div className="card shadow-lg p-4 rounded mb-4" style={{ flex: 1, marginRight: "10px" }}>
          <h3>Total Income</h3>
          <p><strong>Total Income:</strong> {totalIncome !== null ? `$${totalIncome}` : "Loading..."}</p>
        </div>

        {/* Card 2 */}
        <div className="card shadow-lg p-4 rounded mb-4" style={{ flex: 1, marginRight: "10px" }}>
          <h3>Total Expense</h3>
          <p><strong>Total Expense:</strong> {totalExpence !== null ? `$${totalExpence}` : "Loading..."}</p>
        </div>

        {/* Card 3 */}
        <div className="card shadow-lg p-4 rounded mb-4" style={{ flex: 1 }}>
          <h3>Balance</h3>
          <p><strong>Balance:</strong> {totalIncome !== null && totalExpence !== null ? `$${totalIncome - totalExpence}` : "Loading..."}</p>
        </div>
      </div>
      <div className="container p-4">
  <div className="d-flex justify-content-between gap-1">
    <div className="w-50">
      <IncomeChart
        style={{
          width: "100%",  // Ensures chart fills half the container
          height: "900px", // Increased height
          maxWidth: "100%",
          maxHeight: "1200px",
        }}
      />
    </div>
    <div className="w-50">
      <ExpenceChart
        style={{
          width: "100%",  // Ensures chart fills half the container
          height: "900px", // Increased height
          maxWidth: "100%",
          maxHeight: "1200px",
        }}
      />
    </div>
  </div>
</div>



    </div>
  );
};

export default Home;
