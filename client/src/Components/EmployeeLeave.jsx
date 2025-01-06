import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [message, setMessage] = useState(""); // State to display no leaves message
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to fetch leave requests for the logged-in employee
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Get the JWT token
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        const response = await axios.get("http://localhost:3000/auth/leave_request", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.Status) {
          setLeaveRequests(response.data.Result); // Set the leave requests in state
        } else {
          setMessage(response.data.Message || "You have not applied for any leaves yet.");
        }
      } catch (err) {
        setError("An error occurred while fetching leave requests");
        console.error("Error:", err.response ? err.response.data : err);
      }
    };

    fetchLeaveRequests();
  }, []); // Empty dependency array to run once when component mounts

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-4 rounded-md shadow-md max-w-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-center text-2xl font-semibold mb-6 text-blue-500 dark:text-blue-300">
        Employee Leave Requests
      </h2>

      {/* Message for no leave requests */}
      {message && (
        <div className="text-center text-gray-600 dark:text-gray-300 mb-6">{message}</div>
      )}

      {/* Table to display leave requests */}
      {leaveRequests.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">No leave requests found.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-700 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
              <th className="px-4 py-2 text-left">Leave Type</th>
              <th className="px-4 py-2 text-left">From Date</th>
              <th className="px-4 py-2 text-left">From Time</th>
              <th className="px-4 py-2 text-left">To Date</th>
              <th className="px-4 py-2 text-left">To Time</th>
              <th className="px-4 py-2 text-left">Reason</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr key={request.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-2">{request.leave_type}</td>
                <td className="px-4 py-2">{request.from_date}</td>
                <td className="px-4 py-2">{request.from_time}</td>
                <td className="px-4 py-2">{request.to_date}</td>
                <td className="px-4 py-2">{request.to_time}</td>
                <td className="px-4 py-2">{request.Reason}</td>
                <td className="px-4 py-2">{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Apply Leave Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/employee-dashboard/apply_leave")}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          Apply Leave
        </button>
      </div>
    </div>
  );
};

export default EmployeeLeave;
