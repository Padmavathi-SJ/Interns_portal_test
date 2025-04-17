import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [error, setError] = useState("");
  const [isSolutionOpen, setIsSolutionOpen] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(null);
  const [solutionText, setSolutionText] = useState("");

  useEffect(() => {
    const fetchFeedbackList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/get_feedbacks");
        if (Array.isArray(response.data.Feedbacks)) {
          setFeedbackList(response.data.Feedbacks);
        } else {
          console.error("Expected an array but received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Error fetching feedback.");
      }
    };

    fetchFeedbackList();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await axios.put(`http://localhost:3000/admin/update_status/${id}`, { status });
      if (response.data.status) {
        setFeedbackList((prevfeedbackStatus) =>
          prevfeedbackStatus.map((feedbackStatus) =>
            feedbackStatus.id === id ? { ...feedbackStatus, status } : feedbackStatus
          )
        );
      } else {
        console.error("Failed to update feedback status:", response.data.Error);
      }
    } catch (error) {
      console.error("Error updating feedback status:", error);
    }
  };

  const handleSolutionSubmit = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/update_solution/${id}`,
        { solution: solutionText }
      );
      if (response.data.status) {
        setFeedbackList((prevFeedback) =>
          prevFeedback.map((feedback) =>
            feedback.id === id ? { ...feedback, solution: solutionText } : feedback
          )
        );
        setIsSolutionOpen(null);
        setSolutionText("");
      } else {
        console.error("Failed to submit solution:", response.data.Error);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
    }
  };

  const handleCloseCard = () => {
    setIsSolutionOpen(null);
    setIsDescriptionOpen(null);
    setSolutionText("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const filteredFeedbacks = feedbackList.filter((feedback) =>
    feedback.feedback_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedbacks.length / itemsPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-700">Feedback Management</h2>
        <input
          type="text"
          placeholder="Search Feedback Type"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {paginatedFeedbacks.length > 0 ? (
        <>
          <table className="min-w-full table-auto mb-6 bg-white shadow-lg rounded-lg">
            <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 text-blue-700">
              <tr>
                <th className="px-4 py-2 text-left">Employee ID</th>
                <th className="px-4 py-2 text-left">Feedback Type</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
                <th className="px-4 py-2 text-left">Add Solution</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFeedbacks.map((feedback) => (
                <tr key={feedback.id} className="border-b hover:bg-indigo-50 transition-colors">
                  <td className="px-4 py-2 text-gray-800">{feedback.employee_id}</td>
                  <td className="px-4 py-2 text-gray-800">{feedback.feedback_type}</td>
                  <td className="px-4 py-2 text-gray-800">
                    <button
                      onClick={() => setIsDescriptionOpen(feedback.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                      View Description
                    </button>
                  </td>
                  <td className="px-4 py-2 text-gray-800">{feedback.priority}</td>
                  <td className="px-4 py-2 text-gray-800">{feedback.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleStatusUpdate(feedback.id, 'approved')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(feedback.id, 'rejected')}
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Reject
                    </button>
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    <button
                      onClick={() => setIsSolutionOpen(feedback.id)}
                      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-300"
                    >
                      Add Solution
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
        </>
      ) : (
        <p>No feedback available.</p>
      )}

      {/* Modal for Description */}
      {isDescriptionOpen !== null && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Description</h3>
            <p>{feedbackList.find((fb) => fb.id === isDescriptionOpen).description}</p>
            <button
              onClick={handleCloseCard}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal for Add Solution */}
      {isSolutionOpen !== null && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Add Solution</h3>
            <textarea
              rows="3"
              className="w-full border rounded px-2 py-1 mb-4"
              placeholder="Provide solution..."
              value={solutionText}
              onChange={(e) => setSolutionText(e.target.value)}
            ></textarea>
            <button
              onClick={() => handleSolutionSubmit(isSolutionOpen)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition duration-300"
            >
              Post Solution
            </button>
            <button
              onClick={handleCloseCard}
              className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;
