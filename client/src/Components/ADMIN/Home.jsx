import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faClipboardList, 
  faBuilding, 
  faTasks, 
  faComments, 
  faUserShield, 
  faLayerGroup 
} from "@fortawesome/free-solid-svg-icons";

const Home = ({ isSidebarOpen }) => {
  const [metrics, setMetrics] = useState({
    totalEmployees: 0,
    pendingLeaves: 0,
    departments: 0,
    tasksAllocated: 0,
    pendingFeedbacks: 0,
    totalTeams: 0,
    totalAdmins: 0,
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
            pendingFeedbacks: response.data.Metrics.pendingFeedbacks,
            totalTeams: response.data.Metrics.totalTeams,
            totalAdmins: response.data.Metrics.totalAdmins,
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

  const metricIcons = {
    totalEmployees: <FontAwesomeIcon icon={faUsers} className="text-blue-500 text-5xl" />,
    pendingLeaves: <FontAwesomeIcon icon={faClipboardList} className="text-yellow-500 text-5xl" />,
    departments: <FontAwesomeIcon icon={faBuilding} className="text-purple-500 text-5xl" />,
    tasksAllocated: <FontAwesomeIcon icon={faTasks} className="text-green-500 text-5xl" />,
    pendingFeedbacks: <FontAwesomeIcon icon={faComments} className="text-red-500 text-5xl" />,
    totalTeams: <FontAwesomeIcon icon={faLayerGroup} className="text-indigo-500 text-5xl" />,
    totalAdmins: <FontAwesomeIcon icon={faUserShield} className="text-teal-500 text-5xl" />,
  };

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
    <div className={`container mx-auto p-6 transition-all duration-300 max-w-7xl ${isSidebarOpen ? 'ml-64' : 'ml-16'}`}>
      <h2 className="text-3xl font-bold text-center mb-8 text-blue-700">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Object.entries(metrics).map(([key, value]) => (
          <div
            key={key}
            className="bg-gradient-to-r p-7 from-blue-100 via-white to-blue-50 rounded-lg shadow-2xl flex flex-col justify-between transform transition duration-500 hover:scale-105 hover:shadow-4xl relative"
            style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)' }} // Darker shadow
          >
            <span className="absolute top-2 right-2 text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
              {key.includes("pending") ? "Pending" : "Active"}
            </span>
            <div className="flex items-center">
              <div className="mr-5">
                {metricIcons[key]}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-700 capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1')}
                </h3>
                <p className="text-4xl font-bold text-center text-blue-600">{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
