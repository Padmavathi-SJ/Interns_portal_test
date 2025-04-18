import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserTie, FaUsers, FaTasks, FaClipboardList } from 'react-icons/fa';



const WorkAllocation = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="grid grid-cols-2 gap-6">
        {/* Allocate Work for Employee */}
        <Link
          to="/admin-dashboard/allocate_work"
          className="flex flex-col items-center justify-center bg-blue-100 text-blue-800 p-6 rounded-md shadow hover:bg-blue-200 transition"
        >
          <FaUserTie className="text-4xl mb-2" />
          <span className="text-lg font-medium">Allocate Work (Employee)</span>
        </Link>

        {/* Allocate Work for Team */}
        <Link
          to="/admin-dashboard/team_work_allocation"
          className="flex flex-col items-center justify-center bg-green-100 text-green-800 p-6 rounded-md shadow hover:bg-green-200 transition"
        >
          <FaUsers className="text-4xl mb-2" />
          <span className="text-lg font-medium">Allocate Work (Team)</span>
        </Link>

        {/* Tasks Assigned to Employees */}
        <Link
          to="/admin-dashboard/tasks_assigned"
          className="flex flex-col items-center justify-center bg-yellow-100 text-yellow-800 p-6 rounded-md shadow hover:bg-yellow-200 transition"
        >
          <FaTasks className="text-4xl mb-2" />
          <span className="text-lg font-medium">Tasks Assigned (Employee)</span>
        </Link>

        {/* Tasks Assigned to Teams */}
        <Link
          to="/admin-dashboard/team_tasks_assigned"
          className="flex flex-col items-center justify-center bg-purple-100 text-purple-800 p-6 rounded-md shadow hover:bg-purple-200 transition"
        >
          <FaClipboardList className="text-4xl mb-2" />
          <span className="text-lg font-medium">Tasks Assigned (Team)</span>
        </Link>
      </div>
    </div>
  );
};

export default WorkAllocation;
