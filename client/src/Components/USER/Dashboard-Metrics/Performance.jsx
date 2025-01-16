import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

const Performance = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState("Jan");

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const response = await axios.get("http://localhost:3000/auth/employee-performance", {
          headers: { Authorization: `Bearer ${token}` },
          params: { month, year: new Date().getFullYear() },
        });

        if (response.status === 200 && response.data.Status) {
          const data = response.data.Data;

          console.log("Fetched performance data:", data);

          const chartData = [{
            month: month,
            leaveCount: data.leaveCount || 0,
            feedbackCount: data.feedbackCount || 0,
            teamContribution: data.teamContribution || 0,
            workCompletion: data.workCompletion || 0,
          }];
          setPerformanceData(chartData);
        } else {
          setError("Unable to fetch performance data.");
        }
      } catch (err) {
        setError("An error occurred while fetching performance data.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [month]);

  if (loading) return <div>Loading performance data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <select
        value={month}
        onChange={handleMonthChange}
        style={{
          backgroundColor: "#282c34",
          color: "#ffffff",
          border: "1px solid #ffffff",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "16px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="Jan">January</option>
        <option value="Feb">February</option>
        <option value="Mar">March</option>
        <option value="Apr">April</option>
        <option value="May">May</option>
        <option value="Jun">June</option>
        <option value="Jul">July</option>
        <option value="Aug">August</option>
        <option value="Sep">September</option>
        <option value="Oct">October</option>
        <option value="Nov">November</option>
        <option value="Dec">December</option>
      </select>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="leaveCount" fill="#8884d8" />
          <Bar dataKey="feedbackCount" fill="#82ca9d" />
          <Bar dataKey="teamContribution" fill="#ffc658" />
          <Bar dataKey="workCompletion" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Performance;
