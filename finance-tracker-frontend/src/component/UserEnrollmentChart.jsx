import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserEnrollmentChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEnrollmentStats = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await axios.get("http://localhost:5000/api/auth/enrollment-stats", {
          headers: { Authorization: `Bearer ${token}` }, // Include JWT token
        });

        const data = response.data;
        setChartData({
          labels: data.map((item) => item._id), // Month-Year labels
          datasets: [
            {
              label: "Users Enrolled",
              data: data.map((item) => item.count), // User count
              borderColor: "rgba(75,192,192,1)",
              backgroundColor: "rgba(75,192,192,0.2)",
              tension: 0.4, // Smooth the line
            },
          ],
        });
      } catch (err) {
        setError("Failed to load user enrollment data.");
        console.error("Error fetching enrollment stats:", err);
      }
    };

    fetchEnrollmentStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center">User Enrollment Over Time</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default UserEnrollmentChart;
