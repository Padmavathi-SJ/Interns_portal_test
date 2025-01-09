import React from "react";
import Profile from "./Profile";
import TeamDashboard from "./TeamDashboard";
import LeaveDashboard from "./LeaveDashboard"; // Import LeaveDashboard
import Performance from "./Performance"; // Import Performance

const EmployeeHome = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 justify-center">
      {/* Profile */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-auto h-fit sm:col-span-1">
        <Profile />
      </div>

      {/* Leave Dashboard */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-auto h-fit sm:col-span-1">
        <LeaveDashboard />
      </div>

      {/* Performance */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-2 w-full h-fit col-span-full">
        <Performance />
      </div>

      {/* Uncomment below if you want to add TeamDashboard */}
      {/* 
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-4 w-full min-h-fit">
        <TeamDashboard />
      </div>
      */}
    </div>
  );
};

export default EmployeeHome;
