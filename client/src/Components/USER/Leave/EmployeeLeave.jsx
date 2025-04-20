import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const EmployeeLeave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const leaveRequestsPerPage = 8;
  const navigate = useNavigate();

  const getLoggedInEmployeeId = () => {
    const token = localStorage.getItem("userToken");
    if(!token) return null;
    try{
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (err){
      console.log("Failed to decode token: ", err);
      return null;
    }
  }

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      const token = localStorage.getItem("userToken");
      const employeeId = getLoggedInEmployeeId();
      if(!token || !employeeId) {
        setError("Unable to retreive employee tasks. Please log in. ");
        return;
      }
        
      try {
        const response = await axios.get('http://localhost:3000/user/get_leave_requests',
          {headers: { Authorization: `Bearer ${token}` }}
        );

        if (Array.isArray(response.data.Leaves)) {
          setLeaveRequests(response.data.Leaves);
          setFilteredLeaveRequests(response.data.Leaves);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const fetchReason = async (id) => {
    const token = localStorage.getItem("userToken");
    const employeeId = getLoggedInEmployeeId();
    if (!token || !employeeId) {
      setError("Unable to retrieve employee tasks. Please log in.");
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/user/get_reason/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.status && response.data.LeaveReason) {
        console.log("Fetched LeaveReason:", response.data.LeaveReason); // Log to inspect
        setSelectedReason(response.data.LeaveReason); // Make sure this is a string or extract the necessary field
        setIsModalOpen(true);
      } else {
        console.error('No reason found or error:', response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching reason:', error);
    }
  };
  
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReason(null);
  };

  const totalPages = Math.ceil(filteredLeaveRequests.length / leaveRequestsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentLeaveRequests = filteredLeaveRequests.slice(
    (currentPage - 1) * leaveRequestsPerPage,
    currentPage * leaveRequestsPerPage
  );

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-900 dark:to-gray-700 rounded-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-700 dark:text-white">Leave Requests</h2>
        <div className="text-center mb-6">
          <button
            onClick={() => navigate("/employee-dashboard/apply_leave")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
          >
            Apply Leave
          </button>
        </div>
      </div>

      {currentLeaveRequests.length > 0 ? (
        <table className="min-w-full table-auto mb-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-white">
          <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 dark:bg-gray-300 text-blue-700 dark:text-blue">
            <tr>
              <th className="px-4 py-2 text-left">Employee ID</th>
              <th className="px-4 py-2 text-left">Leave Type</th>
              <th className="px-4 py-2 text-left">From Date</th>
              <th className="px-4 py-2 text-left">From Time</th>
              <th className="px-4 py-2 text-left">To Date</th>
              <th className="px-4 py-2 text-left">To Time</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">View Reason</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaveRequests.map((request) => (
              <tr key={request.id} className="border-b hover:bg-indigo-50 dark:hover:bg-indigo-700 dark:border-gray-600 transition-colors">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{request.employee_id}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{request.leave_type}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{request.from_date}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{request.from_time}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{request.to_date}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{request.to_time}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{request.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => fetchReason(request.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    View Reason
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-700 dark:text-gray-300">No leave requests available.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md mr-2 disabled:bg-gray-400 dark:bg-indigo-700 dark:disabled:bg-gray-500"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-700 text-white rounded-md ml-2 disabled:bg-gray-400 dark:bg-blue-800 dark:disabled:bg-gray-500"
          >
            Next
          </button>
        </div>
      )}

{isModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full dark:bg-gray-800 dark:text-white">
      <h3 className="text-xl font-semibold mb-4">Leave Reason</h3>
      <p>{selectedReason[0].Reason}</p> {/* Adjusted this line */}
      <button
        onClick={handleCloseModal}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 dark:bg-red-600 dark:hover:bg-red-700"
      >
        Close
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default EmployeeLeave;
