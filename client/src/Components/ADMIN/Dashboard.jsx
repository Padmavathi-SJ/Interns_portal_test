import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBuilding, FaUserTag, FaTasks, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';
import logo from '../../assets/bit-logo.png';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-${isSidebarOpen ? '64' : '20'} bg-blue-900 text-white p-6 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
            <div>
              <h1 className={`text-3xl font-semibold ${isSidebarOpen ? '' : 'hidden'}`}>BIT</h1>
              <h2 className={`text-lg font-light ${isSidebarOpen ? '' : 'hidden'}`}>INTERNS PORTAL</h2>
            </div>
          </div>
          <button onClick={toggleSidebar} className="text-white">
            {isSidebarOpen ? (
              <span>logo</span>
            ) : (
              <span>logo</span>
            )}
          </button>
        </div>
        <ul>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaTachometerAlt size={24} />
              {isSidebarOpen && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/employee"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaUsers size={24} />
              {isSidebarOpen && <span>Manage Employees</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/department"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaBuilding size={24} />
              {isSidebarOpen && <span>Departments</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/teams"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaUserTag size={24} />
              {isSidebarOpen && <span>Team Management</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/work_allocation"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaTasks size={24} />
              {isSidebarOpen && <span>Allocate Work</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/manage_announcements"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaBell size={24} />
              {isSidebarOpen && <span>Announcements</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/leave"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaSignOutAlt size={24} />
              {isSidebarOpen && <span>Leave</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/feedback"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <MdFeedback size={24} />
              {isSidebarOpen && <span>Feedback</span>}
            </NavLink>
          </li>
          <li className="mb-4">
            <NavLink
              to="/admin-dashboard/admins"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaUsers size={24} />
              {isSidebarOpen && <span>Admins</span>}
            </NavLink>
          </li>
          <li className="mt-8 border-t border-blue-700 pt-4">
            <NavLink
              to="/AdminLogin"
              className={({ isActive }) =>
                `flex items-center space-x-4 transition-colors ${
                  isActive ? 'text-blue-300 border border-blue-300 p-2 rounded' : 'hover:text-blue-200'
                }`
              }
            >
              <FaSignOutAlt size={24} />
              {isSidebarOpen && <span>Logout</span>}
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
