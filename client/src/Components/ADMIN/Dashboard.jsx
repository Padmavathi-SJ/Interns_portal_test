import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBuilding, FaUserTag, FaTasks, FaBell, FaSignOutAlt } from 'react-icons/fa';
import { MdFeedback } from 'react-icons/md';
import logo from '../../assets/logo1.png';


const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-${isSidebarOpen ? '48' : '16'} bg-blue-900 text-white p-4 transition-all duration-300 ease-in-out`}
      >
        <div
          className="flex justify-between items-center mb-8 cursor-pointer"
          onClick={toggleSidebar}
        >
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="w-8 h-8 mr-2" />
            {isSidebarOpen && (
              <div>
                <h1 className="text-2xl font-semibold">BIT</h1>
                <h2 className="text-sm font-light">INTERNS PORTAL</h2>
              </div>
            )}
          </div>
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
              {isSidebarOpen && <span>Manage Interns</span>}
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
      {/* Main Content */}
<div className="flex-1 p-8 bg-white shadow-lg rounded-lg">
  <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
    BIT Interns Portal
  </h2>
  <Outlet />
</div>

    </div>
  );
};

export default Dashboard;
