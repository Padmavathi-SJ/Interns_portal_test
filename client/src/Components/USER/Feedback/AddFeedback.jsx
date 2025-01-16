import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddFeedback = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isConfirmed = window.confirm("Are you sure you want to submit this feedback?");
    if (!isConfirmed) return;

    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("You must be logged in to submit feedback.");
      return;
    }

    const employeeId = JSON.parse(atob(token.split(".")[1])).id;

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/feedback",
        {
          employee_id: employeeId,
          feedback_type: feedbackType,
          description,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Feedback submitted successfully!");
        setStatus("Pending"); // Set initial status to "Pending"
        setFeedbackType("");
        setDescription("");
        setPriority("Medium");
        setError("");

        navigate("/employee-dashboard/feedback");
      } else {
        setError(response.data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:bg-gradient-to-r dark:from-blue-900 dark:via-gray-800 dark:to-blue-900 rounded-lg shadow-lg dark:shadow-none max-w-lg">
      <h2 className="text-center text-3xl font-semibold mb-6 text-blue-600 dark:text-blue-400">Submit Feedback</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}


      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="feedbackType" className="block text-gray-700 dark:text-gray-200">Feedback Type</label>
          <select
            id="feedbackType"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Feedback Type</option>
            <option value="General">General</option>
            <option value="Complaint">Complaint</option>
            <option value="Support">Support</option>
            <option value="Tools Request">Tools Request</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-gray-700 dark:text-gray-200">Priority Level</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 dark:text-gray-200">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default AddFeedback;
