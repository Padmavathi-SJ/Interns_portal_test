import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [error, setError] = useState("");
  const [isSolutionOpen, setIsSolutionOpen] = useState(null); // Track which solution container is open
  const [solutionText, setSolutionText] = useState(""); // Store the solution being typed

  useEffect(() => {
    const fetchFeedbackList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/feedback");
        if (Array.isArray(response.data.Result)) {
          setFeedbackList(response.data.Result);
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
      const response = await axios.put(`http://localhost:3000/auth/feedback/${id}`, { status });
      if (response.data.Status) {
        setFeedbackList((prevFeedback) =>
          prevFeedback.map((feedback) =>
            feedback.id === id ? { ...feedback, status } : feedback
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
        `http://localhost:3000/auth/feedback/${id}/solution`,
        { solution: solutionText }
      );
      if (response.data.Status) {
        setFeedbackList((prevFeedback) =>
          prevFeedback.map((feedback) =>
            feedback.id === id ? { ...feedback, solution: solutionText } : feedback
          )
        );
        setIsSolutionOpen(null); // Close the solution container
        setSolutionText(""); // Clear the solution text
      } else {
        console.error("Failed to submit solution:", response.data.Error);
      }
    } catch (error) {
      console.error("Error submitting solution:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Feedback Management</h2>
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-2 text-left">Feedback Type</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Priority</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Solution</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback) => (
            <tr key={feedback.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{feedback.feedback_type}</td>
              <td className="px-4 py-2">{feedback.description}</td>
              <td className="px-4 py-2">{feedback.priority}</td>
              <td className="px-4 py-2">{feedback.status}</td>
              <td className="px-4 py-2">
                {isSolutionOpen === feedback.id ? (
                  <div>
                    <textarea
                      rows="3"
                      className="w-full border rounded px-2 py-1"
                      placeholder="Provide solution..."
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                    ></textarea>
                    <button
                      onClick={() => handleSolutionSubmit(feedback.id)}
                      className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                      Post Solution
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsSolutionOpen(feedback.id)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Add Solution
                  </button>
                )}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleStatusUpdate(feedback.id, 'approved')}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(feedback.id, 'rejected')}
                  className="ml-2 px-3 py-1 bg-red-600 text-white rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFeedback;
