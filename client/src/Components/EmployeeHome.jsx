import React from "react";
import Profile from "./Profile";
import TeamDashboard from "./TeamDashboard";
import LeaveDashboard from "./LeaveDashboard"; // Import LeaveDashboard
import Performance from "./Performance"; // Import Performance

const EmployeeHome = () => {
  return (
    <div className="flex flex-wrap gap-4 p-6 justify-center">
      {/* First row: Profile, LeaveDashboard, Performance */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-4 w-auto sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4">
        <Profile />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-4 w-auto sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/4">
        <LeaveDashboard />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3">
        <Performance />
      </div>

    </div>
  );
};

export default EmployeeHome;


/*
<div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg p-4 w-full sm:w-1/2 lg:w-1/4">
        <TeamDashboard />
      </div>
*/