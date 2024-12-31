import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { SunIcon, MoonIcon, UserIcon, LogoutIcon } from "@heroicons/react/solid";
import EmployeeProfile from './EmployeeProfile'; // Import EmployeeProfile component
import profileImage from "../assets/profile.jpg";

const EmployeeDashboard = () => {
  const location = useLocation();
  const [employeeName, setEmployeeName] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false); // State to control profile modal visibility

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode); // Toggle the 'dark' class on the root element
      localStorage.setItem("darkMode", newMode); // Persist dark mode preference
      return newMode;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("employeeId");
    window.location.href = "/userLogin";
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const navLinks = [
    { path: "/employee-dashboard", label: "Dashboard" },
    { path: "/employee-dashboard/employee_task", label: "Allocated Work" },
    { path: "/employee-dashboard/employee_leave", label: "Leave" },
    { path: "/employee-dashboard/feedback", label: "Feedback" },
    { path: "/employee-dashboard/anouncements", label: "Anouncements" },
  ];

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get("http://localhost:3000/auth/get_employee", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.Status) {
          setEmployeeName(response.data.Data.name);
        } else {
          console.error(response.data.Error || "Failed to fetch employee details.");
        }
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchEmployeeDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-300 dark:border-gray-700 shadow-md">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-semibold text-blue-500 dark:text-blue-300">BIP</h1>

          {/* Navigation Links */}
          <div className="flex-1 flex justify-center items-center">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`px-3 py-2 border-b-2 transition-colors ${
                      location.pathname === link.path
                        ? "border-blue-500 text-blue-500" // Active link - blue border and text
                        : "border-transparent hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-300 dark:hover:text-blue-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
          <button
  onClick={toggleDropdown}
  className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold shadow-md dark:bg-blue-700 overflow-hidden"
>
  {profileImage ? (
    <img
      src={profileImage} // Replace with the actual profile image URL
      alt="Profile"
      className="w-full h-full object-cover rounded-full"
    />
  ) : (
    <span>{employeeName ? employeeName.slice(0, 2).toUpperCase() : "XX"}</span>
  )}
</button>


            {showDropdown && (
              <div className="absolute right-0 mt-2 w-16 bg-white text-gray-800 border border-gray-300 shadow-lg rounded-md z-10 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600">
                <button
                  onClick={toggleDarkMode}
                  className="block w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-gray-800 dark:hover:text-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {darkMode ? (
                      <SunIcon className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <MoonIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                </button>
                <button
                  onClick={() => setShowProfileModal(true)} // Show profile modal
                  className="block w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-gray-800 dark:hover:text-blue-300 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-200" />
                  </div>
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 transition-colors dark:text-red-400 dark:hover:bg-red-800 dark:hover:text-white"
                >
                  <div className="flex items-center space-x-2">
                    <LogoutIcon className="w-5 h-5 text-red-500" />

                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 text-gray-800 dark:text-gray-200">
        <Outlet />
      </div>

      {/* Employee Profile Modal */}
      {showProfileModal && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
    <div className=" bg-red rounded-lg shadow-lg p-5 w-4/4 max-w-3xl max-h-[90vh]">
      {/* Employee Profile Component */}
      <EmployeeProfile />
      
      {/* Close Button */}
      <button
        onClick={() => setShowProfileModal(false)} // Close modal
        className="absolute top-3 right-3 p-2 text-white bg-red-500 hover:bg-red-600 rounded-full"
      >
        X
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default EmployeeDashboard;
