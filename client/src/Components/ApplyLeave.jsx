import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const ApplyLeave = () => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(""); // Added status state
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const leaveTypes = ["Sick Leave", "Vacation", "Personal Leave", "Maternity Leave", "Other"];

  const navigate = useNavigate(); // Create navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmation alert
    const isConfirmed = window.confirm("Are you sure you want to apply for this leave?");
    if (!isConfirmed) {
      return; // If the user clicks "Cancel", exit the function
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
          start_date: startDate,
          end_date: endDate,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.Status) {
        setSuccessMessage("Leave request submitted successfully.");
        setStatus("Pending");  // Set status to "Pending" after submission
        setLeaveType("");
        setStartDate("");
        setEndDate("");
        setReason("");
        setError("");

        // Navigate to "employee-dashboard/employee_leave" component after success
        navigate('/employee-dashboard/employee_leave');  // Navigate to the EmployeeLeave component
      } else {
        setError(response.data.Error || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred while applying for leave.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Apply for Leave</h2>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      {/* Display leave request status */}
      {status && (
        <div className="text-lg mt-4">
          <strong>Status:</strong> {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <label htmlFor="leaveType" className="block text-gray-700">Leave Type</label>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-gray-700">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-gray-700">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="reason" className="block text-gray-700">Reason</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit Leave Request
        </button>
      </form>
    </div>
  );
};

export default ApplyLeave;
