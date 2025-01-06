import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import { SunIcon, MoonIcon, UserIcon, LogoutIcon } from "@heroicons/react/solid";
import EmployeeProfile from './EmployeeProfile';
import profileImage from "../assets/profile.jpg";

const EmployeeDashboard = () => {
  const location = useLocation();
  const [employeeName, setEmployeeName] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("darkMode", newMode);
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
    { path: "/employee-dashboard/my_team", label: "My Team" },
    { path: "/employee-dashboard/anouncements", label: "Announcements" },
    { path: "/employee-dashboard/feedback", label: "Feedback" },
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex flex-col">
      <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-300 dark:border-gray-700 shadow-lg rounded-b-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-blue-500 dark:text-blue-300 transition-all hover:text-blue-400">BIP</h1>

          <div className="flex-1 flex justify-center items-center space-x-6">
            {navLinks.map((link) => (
              <li key={link.path} className="list-none">
                <Link
                  to={link.path}
                  className={`px-4 py-2 rounded-md transition-colors text-lg ${
                    location.pathname === link.path
                      ? "border-b-2 border-blue-500 text-blue-500 font-bold"
                      : "border-transparent hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-300 dark:hover:text-blue-300"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </div>

          <div className="relative flex items-center space-x-4">
            <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{employeeName}</span>
            <button
              onClick={toggleDropdown}
              className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-bold shadow-md dark:bg-blue-700 hover:opacity-80"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span>{employeeName ? employeeName.slice(0, 2).toUpperCase() : "XX"}</span>
              )}
            </button>

            {showDropdown && (
  <div
    className="absolute right-0 top-full mt-2 min-w-max bg-white text-gray-800 border border-gray-300 shadow-lg rounded-md z-10 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
  >
    <button
      onClick={toggleDarkMode}
      className="block w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-blue-300 transition-colors"
    >
      <div className="flex items-center space-x-2">
        {darkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-500" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </button>
    <button
      onClick={() => setShowProfileModal(true)}
      className="block w-full px-4 py-2 text-left hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-gray-600 dark:hover:text-blue-300 transition-colors"
    >
      <div className="flex items-center space-x-2">
        <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-200" />
      </div>
    </button>
    <button
      onClick={handleLogout}
      className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-100 transition-colors dark:text-red-400 dark:hover:bg-red-600"
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

      <div className="flex-1 p-8">
        <Outlet />
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
            <EmployeeProfile />

            <button
              onClick={() => setShowProfileModal(false)}
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
