import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null); // State to store the selected leave reason
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle the modal visibility

  // Fetch leave requests when component loads
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/leave_requests');
        if (Array.isArray(response.data.Result)) {
          setLeaveRequests(response.data.Result);
        } else {
          console.error('Expected an array but received:', response.data);
        }
      } catch (error) {
        console.error('Error fetching leave requests:', error);
      }
    };

    fetchLeaveRequests();
  }, []);

  // Handle approve/reject action
  const handleAction = async (id, action) => {
    try {
      const response = await axios.put(`http://localhost:3000/auth/leave_requests/${id}`, { status: action });

      if (response.data.Status) {
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

  // Function to fetch reason based on employee_id
  const fetchReason = async (id) => {
    try {
      // Update the API call to use 'id' instead of 'employeeId'
      const response = await axios.get(`http://localhost:3000/auth/leave_request_reason/${id}`);
  
      if (response.data.Status && response.data.Reason) {
        setSelectedReason(response.data.Reason); // Set the reason
        setIsModalOpen(true); // Open the modal
      } else {
        console.error('No reason found or error:', response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching reason:', error);
    }
  };
  

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReason(null); // Clear the selected reason
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Leave Management</h2>
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-2 text-left">Employee ID</th>
            <th className="px-4 py-2 text-left">Leave Type</th>
            <th className="px-4 py-2 text-left">From Date</th>
            <th className="px-4 py-2 text-left">To Date</th>
            <th className="px-4 py-2 text-left">From Time</th>
            <th className="px-4 py-2 text-left">To Time</th>
            <th className="px-4 py-2 text-left">Action</th>
            <th className="px-4 py-2 text-left">View Reason</th> {/* New column for viewing the reason */}
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{request.employee_id}</td>
              <td className="px-4 py-2">{request.leave_type}</td>
              <td className="px-4 py-2">{request.from_date}</td>
              <td className="px-4 py-2">{request.to_date}</td>
              <td className="px-4 py-2">{request.from_time}</td>
              <td className="px-4 py-2">{request.to_time}</td>
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
                {/* "View Reason" button */}
                <button
                  onClick={() => fetchReason(request.id)}  // Fetch reason based on employee_id
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  View Reason
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal to display the reason */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Leave Reason</h3>
            <p>{selectedReason}</p>
            <button
              onClick={handleCloseModal}  // Close the modal
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
