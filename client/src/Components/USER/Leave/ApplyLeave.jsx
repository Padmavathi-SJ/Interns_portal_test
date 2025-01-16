import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [fromTime, setFromTime] = useState(""); // New state for from time
  const [toTime, setToTime] = useState(""); // New state for to time
  const [status, setStatus] = useState(""); // Added status state
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const leaveTypes = ["Leave", "ON DUTY", "INTERNAL OD", "Internal Training"];
  
  const navigate = useNavigate(); // Create navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Confirmation alert
    const isConfirmed = window.confirm("Are you sure you want to apply for this leave?");
    if (!isConfirmed) {
      return;
    }
  
    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("You must be logged in to apply for leave.");
      return;
    }
  
    const employeeId = JSON.parse(atob(token.split(".")[1])).id;
  
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/apply_leave",
        {
          employee_id: employeeId,
          leave_type: leaveType,
          from_date: startDate,  // Use from_date and to_date (aligned with schema)
          to_date: endDate,
          from_time: fromTime,
          to_time: toTime,
          Reason: reason,  // Use Reason (case-sensitive to match the MySQL column)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.Status) {
        setSuccessMessage("Leave request submitted successfully.");
        setStatus("Pending");
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
        setFromTime("");
        setToTime("");
        setError("");
  
        navigate('/employee-dashboard/employee_leave');
      } else {
        setError(response.data.Error || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred while applying for leave.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:bg-gradient-to-r dark:from-blue-900 dark:via-gray-800 dark:to-blue-900 rounded-lg shadow-lg dark:shadow-none max-w-lg">

      <h2 className="text-center text-3xl font-semibold mb-6 text-blue-600 dark:text-blue-400">Apply for Leave</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

      {/* Display leave request status */}
      {status && (
        <div className="text-lg mt-4 font-medium text-gray-700 dark:text-gray-300">
          <strong>Status:</strong> {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="leaveType" className="block text-gray-700 dark:text-gray-200">Leave Type</label>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-gray-700 dark:text-gray-200">From Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="fromTime" className="block text-gray-700 dark:text-gray-200">From Time</label>
          <input
            type="time"
            id="fromTime"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-gray-700 dark:text-gray-200">To Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="toTime" className="block text-gray-700 dark:text-gray-200">To Time</label>
          <input
            type="time"
            id="toTime"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-gray-700 dark:text-gray-200">Reason</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md dark:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Submit Leave Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyLeave;
