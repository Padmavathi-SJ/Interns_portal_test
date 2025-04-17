import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredLeaveRequests, setFilteredLeaveRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReason, setSelectedReason] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const leaveRequestsPerPage = 8;

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/get_leave_requests');
        if (Array.isArray(response.data.LeaveRequests)) {
          setLeaveRequests(response.data.LeaveRequests);
          setFilteredLeaveRequests(response.data.LeaveRequests);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const response = await axios.put(`http://localhost:3000/admin/update_leave_reason/${id}`, { status: action });

      if (response.data.status) {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status: action } : request
          )
        );
      } else {
        console.error('Failed to update status:', response.data.Error);
      }
    } catch (error) {
      console.error('Error updating leave request:', error);
    }
  };

  const fetchReason = async (id) => {
    try {
      const response = await axios.get(`http://localhost:3000/admin/get_leave_reason/${id}`);
      if (response.data.status && response.data.LeaveReason && response.data.LeaveReason.length > 0) {
        setSelectedReason(response.data.LeaveReason[0]);  // ✅ Corrected here
        setIsModalOpen(true);
      } else {
        console.error('No reason found or error:', response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching reason:', error);
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = leaveRequests.filter((request) =>
      request.employee_id.toString().includes(e.target.value) || request.leave_type.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredLeaveRequests(filtered);
    setCurrentPage(1);
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
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-700">Leave Management</h2>
        <input
          type="text"
          placeholder="Search leave requests..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {currentLeaveRequests.length > 0 ? (
        <table className="min-w-full table-auto mb-6 bg-white shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 text-blue-700">
            <tr>
              <th className="px-4 py-2 text-left">Employee ID</th>
              <th className="px-4 py-2 text-left">Leave Type</th>
              <th className="px-4 py-2 text-left">From Date</th>
              <th className="px-4 py-2 text-left">From Time</th>
              <th className="px-4 py-2 text-left">To Date</th>
              <th className="px-4 py-2 text-left">To Time</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">View Reason</th>
            </tr>
          </thead>
          <tbody>
            {currentLeaveRequests.map((request) => (
              <tr key={request.id} className="border-b hover:bg-indigo-50 transition-colors">
                <td className="px-4 py-2 text-gray-800">{request.employee_id}</td>
                <td className="px-4 py-2 text-gray-800">{request.leave_type}</td>
                <td className="px-4 py-2 text-gray-800">{request.from_date}</td>
                <td className="px-4 py-2 text-gray-800">{request.from_time}</td>
                <td className="px-4 py-2 text-gray-800">{request.to_date}</td>
                <td className="px-4 py-2 text-gray-800">{request.to_time}</td>
                <td className="px-4 py-2">
                  {request.status && request.status.toLowerCase() === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction(request.id, 'approved')}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(request.id, 'rejected')}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {request.status && request.status.toLowerCase() !== 'pending' && <span>{request.status}</span>}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => fetchReason(request.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    View Reason
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leave requests available.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md mr-2 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-700 text-white rounded-md ml-2 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Leave Reason</h3>
            <p>{selectedReason?.Reason}</p>
            <button
              onClick={handleCloseModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leave;
