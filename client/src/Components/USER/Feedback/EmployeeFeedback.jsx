import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbackList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/feedback_list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        if (response.data.Status && Array.isArray(response.data.Result)) {
          setFeedbackList(response.data.Result);
        } else {
          setMessage(response.data.Message || "No feedback found.");
        }
      } catch (error) {
        setError("An error occurred while fetching feedback.");
      }
    };

    fetchFeedbackList();
  }, []);

  const handleViewSolution = (solution) => {
    setSelectedSolution(solution);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSolution(null);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:bg-gradient-to-r dark:from-blue-900 dark:via-gray-800 dark:to-blue-900 rounded-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-700 dark:text-white">My Feedback</h2>
        <button
          onClick={() => navigate("/employee-dashboard/add_feedback")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
        >
          Give Feedback
        </button>
      </div>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {message && <div className="text-center text-gray-600 dark:text-gray-300">{message}</div>}

      {feedbackList.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">No feedback found.</div>
      ) : (
        <table className="min-w-full table-auto mb-6 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-white">
          <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 dark:bg-gray-300 text-blue-700 dark:text-blue">
            <tr>
              <th className="px-4 py-2 text-left">Feedback Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((feedback) => (
              <tr key={feedback.id} className="border-b hover:bg-indigo-50 dark:hover:bg-indigo-700 dark:border-gray-600 transition-colors">
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{feedback.feedback_type}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{feedback.description}</td>
                <td className="px-4 py-2 text-gray-800 dark:text-gray-300">{feedback.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewSolution(feedback.solution)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 dark:bg-blue-600 dark:hover:bg-blue-700"
                  >
                    View Solution
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Viewing Solution */}
      {isModalOpen && selectedSolution && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg max-w-md w-full dark:bg-gray-800 dark:text-white">
      <h3 className="text-xl font-semibold mb-4">Solution</h3>
      <p>{selectedSolution}</p>
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

export default EmployeeFeedback;
