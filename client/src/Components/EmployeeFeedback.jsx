import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [selectedSolution, setSelectedSolution] = useState(null);

  useEffect(() => {
    const fetchFeedbackList = async () => {
      try {
        // Assuming we get the employeeId from session or token (replace with actual logic)
        const response = await axios.get("http://localhost:3000/auth/feedback_list", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, // Assuming token is stored in localStorage
          },
        });
        if (response.data.Status && Array.isArray(response.data.Result)) {
          setFeedbackList(response.data.Result);
        } else {
          console.error("Expected an array but received:", response.data);
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedbackList();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">My Feedback</h2>
      <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            <th className="px-4 py-2 text-left">Feedback Type</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.map((feedback) => (
            <tr key={feedback.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{feedback.feedback_type}</td>
              <td className="px-4 py-2">{feedback.description}</td>
              <td className="px-4 py-2">{feedback.status}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setSelectedSolution(feedback.solution)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Solution
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedSolution && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Solution</h3>
            <p className="text-gray-700">{selectedSolution}</p>
            <button
              onClick={() => setSelectedSolution(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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
