import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Register necessary components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ExpenseChart = () => {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    const fetchExpenseData = async () => {
      const token = localStorage.getItem('token'); // Get JWT token
      const userDetails = JSON.parse(localStorage.getItem("user")); // Get user details
      const userId = userDetails ? userDetails.id : null; // Extract user ID

      if (!token || !userId) {
        console.error("User ID or Token is missing");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/expenses/user/expence-over-time/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setExpenseData(response.data);
      } catch (error) {
        console.error('Failed to fetch expense data over time:', error);
      }
    };
    
    fetchExpenseData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: expenseData.length > 0 ? expenseData.map(item => `Month ${item.month}`) : ["No Data"],
    datasets: [
      {
        label: 'Total Expense Over Time',
        data: expenseData.length > 0 ? expenseData.map(item => item.totalExpense) : [0],
        fill: true,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        tension: 0.3,
      }
    ]
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-center text-xl font-semibold mb-4">Expense Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ExpenseChart;
