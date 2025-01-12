import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const EmployeeFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);
  const [message, setMessage] = useState(""); // Message for no feedback
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const navigate = useNavigate(); // Hook to navigate to another page

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

  // Function to handle opening the view solution modal
  const handleViewSolution = (solution) => {
    setSelectedSolution(solution); // Store selected solution to show
    setIsModalOpen(true); // Open the modal
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedSolution(null); // Clear selected solution
  };

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">My Feedback</h2>

      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      {message && <div className="text-center text-gray-600 dark:text-gray-300">{message}</div>}

      <div className="text-center mb-6">
        <button
          onClick={() => navigate("/employee-dashboard/add_feedback")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Give Feedback
        </button>
      </div>

      {feedbackList.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">No feedback found.</div>
      ) : (
        <table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-700 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
              <th className="px-4 py-2 text-left">Feedback Type</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.map((feedback) => (
              <tr key={feedback.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-4 py-2">{feedback.feedback_type}</td>
                <td className="px-4 py-2">{feedback.description}</td>
                <td className="px-4 py-2">{feedback.status}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewSolution(feedback.solution)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 border-2 dark:border-gray-600 border-gray-300">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Solution</h3>
        <button
          className="text-red-500"
          onClick={handleCloseModal} // Close the modal
        >
          Close
        </button>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">{selectedSolution}</p>
    </div>
  </div>
)}

    </div>
  );
};

export default EmployeeFeedback;
