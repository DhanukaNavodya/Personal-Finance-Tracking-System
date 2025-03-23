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

const IncomeChart = () => {
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    const fetchIncomeData = async () => {
      const token = localStorage.getItem('token'); // Get JWT token
      const userDetails = JSON.parse(localStorage.getItem("user")); // Get user details
      const userId = userDetails ? userDetails.id : null; // Extract user ID

      if (!token || !userId) {
        console.error("User ID or Token is missing");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/incomes/user/income-over-time/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIncomeData(response.data);
      } catch (error) {
        console.error('Failed to fetch income data over time:', error);
      }
    };
    
    fetchIncomeData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: incomeData.length > 0 ? incomeData.map(item => `Month ${item.month}`) : ["No Data"],
    datasets: [
      {
        label: 'Total Income Over Time',
        data: incomeData.length > 0 ? incomeData.map(item => item.totalIncome) : [0],
        fill: true,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
      }
    ]
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-center text-xl font-semibold mb-4">Income Over Time</h2>
      <Line data={chartData} />
    </div>
  );
};

export default IncomeChart;
