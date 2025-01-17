import React from "react";
import Profile from "./Profile";
import TeamDashboard from "./TeamDashboard";
import LeaveDashboard from "./LeaveDashboard"; // Import LeaveDashboard
import Performance from "./Performance"; // Import Performance

const EmployeeHome = () => {
  return (
    <div className="flex flex-wrap justify-between p-4 gap-5">
      {/* Profile */}
      
      {/* Leave Dashboard and Team Dashboard */}
      <div className="bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex-1 max-w-lg h-full flex flex-col justify-between">
        <LeaveDashboard />
        <TeamDashboard />
      </div>

      {/* Performance */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-4 flex-1 max-w-lg h-full">
        <Performance />
      </div>
    </div>
  );
};

export default EmployeeHome;
