import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    departments: 0,
    tasksAllocated: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("No token found. Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:3000/auth/dashboard_metrics", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.Status && response.data.Metrics) {
          setMetrics({
            totalEmployees: response.data.Metrics.totalEmployees,
            pendingLeaves: response.data.Metrics.pendingLeaveRequests,
            departments: response.data.Metrics.totalDepartments,
            tasksAllocated: response.data.Metrics.totalTasks,
          });
        } else {
          setError(response.data.Message || "Unable to fetch metrics");
        }
      } catch (err) {
        setError("An error occurred while fetching dashboard metrics");
        console.error("Error:", err.response ? err.response.data : err);
      }
    };

    fetchMetrics();
  }, []);

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
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Admin Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">Total Employees</h3>
          <p className="text-4xl font-bold text-blue-500">{metrics.totalEmployees}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">Pending Leave Requests</h3>
          <p className="text-4xl font-bold text-yellow-500">{metrics.pendingLeaves}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">Departments</h3>
          <p className="text-4xl font-bold text-green-500">{metrics.departments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-xl font-semibold text-gray-600 mb-4">Work Allocations</h3>
          <p className="text-4xl font-bold text-purple-500">{metrics.tasksAllocated}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
