import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [monthRange, setMonthRange] = useState("Jan-Feb");

  const isTokenExpired = (token) => {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (e) {
      console.error("Error decoding token:", e);
      return true;
    }
  };

  const handleMonthRangeChange = (e) => {
    setMonthRange(e.target.value);
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("No token found, please log in.");
          setLoading(false);
          return;
        }

        if (isTokenExpired(token)) {
          setError("Token expired, please log in again.");
          setLoading(false);
          return;
        }

        // Fetch data for the selected month range
        const response = await axios.get("http://localhost:3000/auth/employee-performance", {
          headers: { Authorization: `Bearer ${token}` },
          params: { monthRange }
        });

        if (response.status === 200 && response.data) {
          const data = response.data.Data;
          const leaveCount = Array.isArray(data.leaveCount) ? data.leaveCount : [];
          const feedbackCount = Array.isArray(data.feedbackCount) ? data.feedbackCount : [];

          const chartData = leaveCount.map((item, index) => ({
            month: item.month,
            leaveCount: item.leave_count,
            feedbackCount: feedbackCount[index]?.feedback_count || 0,
            teamContribution: index === 0 ? data.teamContribution : 0,
            workCompletion: leaveCount.length ? data.workCompletion / leaveCount.length : 0,
          }));

          setPerformanceData(chartData);
        } else {
          setError("Unable to fetch performance data.");
        }
      } catch (err) {
        setError("An error occurred while fetching performance data.");
        console.error("Error:", err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [monthRange]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-600 font-semibold">Loading performance data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-600 p-4 rounded-md shadow-md max-w-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-center">Employee Performance</h2>

      {/* Month Range Selector */}
      <div className="flex justify-center mb-4">
        <select
          value={monthRange}
          onChange={handleMonthRangeChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="Jan-Feb">Jan to Feb</option>
          <option value="Feb-Mar">Feb to Mar</option>
          <option value="Mar-Apr">Mar to Apr</option>
          <option value="Apr-May">Apr to May</option>
          {/* Add more ranges as needed */}
        </select>
      </div>

      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="leaveCount" fill="#8884d8" barSize={25} />
            <Bar dataKey="feedbackCount" fill="#82ca9d" barSize={25} />
            <Bar dataKey="teamContribution" fill="#ffc658" barSize={25} />
            <Bar dataKey="workCompletion" fill="#ff7300" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Performance;
