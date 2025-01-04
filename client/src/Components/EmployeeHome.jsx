import React from "react";
import Profile from "./Profile";
import TeamDashboard from "./TeamDashboard";
import LeaveDashboard from "./LeaveDashboard"; // Import LeaveDashboard

const EmployeeHome = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6">
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <Profile />
      </div>
      
      {/* Team Dashboard Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <TeamDashboard />
      </div>

      {/* Leave Dashboard Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-6">
        <LeaveDashboard /> {/* Add LeaveDashboard here */}
      </div>
    </div>
  );
};

export default EmployeeHome;
