import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

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
  const handleAction = async (id, status) => {
    try {
      // Send status change request to the backend
      const response = await axios.put(`http://localhost:3000/auth/leave_requests/${id}`, { status });

      // If the request is successful, update the local state
      if (response.data.Status) {
        setLeaveRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === id ? { ...request, status } : request
          )
        );
      } else {
        console.error('Failed to update status:', response.data.Error);
      }
    } catch (error) {
      console.error('Error updating leave request:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Leave Management</h2>
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-2 text-left">Employee ID</th>
            <th className="px-4 py-2 text-left">Leave Type</th>
            <th className="px-4 py-2 text-left">Start Date</th>
            <th className="px-4 py-2 text-left">End Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((request) => (
            <tr key={request.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{request.employee_id}</td>
              <td className="px-4 py-2">{request.leave_type}</td>
              <td className="px-4 py-2">{request.start_date}</td>
              <td className="px-4 py-2">{request.end_date}</td>
              <td className="px-4 py-2">{request.status}</td>
              <td className="px-4 py-2">
                {request.status === 'pending' && (
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leave;
