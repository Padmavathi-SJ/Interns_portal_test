import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h1 className="text-3xl font-semibold mb-8">BIP</h1>
        <ul>
          <li className="mb-4">
            <Link to="/admin-dashboard" className="hover:text-indigo-200 transition-colors">
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin-dashboard/employee" className="hover:text-indigo-200 transition-colors">
              Manage Employees
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin-dashboard/department" className="hover:text-indigo-200 transition-colors">
              Departments
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin-dashboard/work_allocation" className="hover:text-indigo-200 transition-colors">
              Allocate Work
            </Link>
          </li>
          <li className="mb-4">
            <Link to="/admin-dashboard/leave" className="hover:text-indigo-200 transition-colors">
              Leave
            </Link>
          </li>
          <li className="mt-8 border-t border-indigo-700 pt-4">
            <Link to="/AdminLogin" className="hover:text-indigo-200 transition-colors">
              Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>

        {/* Render child components here */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
