import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF4C4C"]; // Good, Moderate, Needs Improvement

const monthsList = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const PerformanceMetric = () => {
  const [month, setMonth] = useState("");
  const [performanceData, setPerformanceData] = useState([]);
  const [chartData, setChartData] = useState([]);

// Function to get the current year
const getCurrentYear = () => {
  return new Date().getFullYear();
};

const fetchPerformance = async (selectedMonth) => {
  const fullMonth = `${getCurrentYear()}-${selectedMonth}`;
  console.log("Fetching performance for:", fullMonth);  
  try {
    const res = await axios.get(`http://localhost:3000/admin/get_monthly_performance?month=${fullMonth}`);
    console.log("response: ", res.data);
    setPerformanceData(res.data.PerformanceType);

    const count = {
      Good: 0,
      Moderate: 0,
      "Needs Improvement": 0,
    };

    res.data.PerformanceType.forEach((emp) => {
      count[emp.performance]++;
    });

    const pieData = Object.entries(count).map(([name, value]) => ({ name, value }));
    setChartData(pieData);
  } catch (err) {
    console.error("Error fetching performance metrics", err);
  }
};

  useEffect(() => {
    if (month) fetchPerformance(month);
  }, [month]);

  return (
    <div className="w-full p-4 bg-white rounded-2xl border border-blue-600 relative mt-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
      <label className="font-semibold text-gray-700">Performance</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm"
        >
          <option value="">Select Month</option>
          {monthsList.map((m, idx) => (
            <option key={idx} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {chartData.length > 0 ? (
        <PieChart width={400} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={50}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      ) : (
        <p className="text-gray-500">No performance data for selected month.</p>
      )}
    </div>
  );
};

export default PerformanceMetric;
