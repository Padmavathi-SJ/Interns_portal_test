import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const EmployeeDashboard = () => {
  const location = useLocation();
  const employeeId = localStorage.getItem("employeeId"); // Fetch employeeId from storage
  const employeeName = "John Doe"; // Replace with dynamic name if available
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("employeeId");
    window.location.href = "/userLogin"; // Redirect to login page
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const navLinks = [
    { path: "/employee-dashboard", label: "Dashboard" },
    { path: "/employee-dashboard/profile", label: "Profile" },
    { path: "/employee-dashboard/employee_task", label: "Allocated Work" },
    { path: "/employee-dashboard/employee_leave", label: "Leave" },
    { path: "/employee-dashboard/feedback", label: "Feedback" },
    { path: "/employee-dashboard/anouncements", label: "Anouncements" },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-100"} flex flex-col`}>
      {/* Top Navigation Bar */}
      <div
        className={`${
          darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
        } px-6 py-4 border-b ${darkMode ? "border-gray-700" : "border-gray-300"} shadow-md`}
      >
        <div className="flex items-center justify-between">
          {/* Logo aligned to the left */}
          <div className="flex items-center justify-start">
            <h1 className="text-2xl font-semibold">BIP</h1>
          </div>

          {/* Centered Navigation Links */}
          <div className="flex-1 flex justify-center items-center">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`px-3 py-2 rounded-md transition-colors ${
                      location.pathname === link.path
                        ? darkMode
                          ? "bg-indigo-500 text-white"
                          : "bg-indigo-600 text-white"
                        : darkMode
                        ? "hover:bg-gray-700 hover:text-gray-300"
                        : "hover:bg-gray-200 hover:text-gray-800"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Icon with Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-md"
            >
              {employeeName.slice(0, 2).toUpperCase()}
            </button>

            {showDropdown && (
              <div
                className={`absolute right-0 mt-2 w-48 ${
                  darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                } border ${darkMode ? "border-gray-700" : "border-gray-300"} shadow-lg rounded-md z-10`}
              >
                <button
                  onClick={toggleDarkMode}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-700 hover:text-gray-300 transition-colors"
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-8 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
        <h2 className="text-3xl font-semibold mb-6">Welcome Employee</h2>

        {/* Render child components here */}
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
