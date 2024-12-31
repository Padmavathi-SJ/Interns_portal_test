import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddFeedback = () => {
  const [feedbackType, setFeedbackType] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState(""); // Added status tracking
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

        // Navigate to a feedback dashboard or another relevant page
        navigate("/employee-dashboard/feedback");
      } else {
        setError(response.data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred while submitting feedback.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Submit Feedback</h2>
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      {status && (
        <div className="text-lg mt-4">
          <strong>Status:</strong> {status}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
        <div>
          <label htmlFor="feedbackType" className="block text-gray-700">Feedback Type</label>
          <select
            id="feedbackType"
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            className="w-full p-2 border rounded-lg"
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
          <label htmlFor="priority" className="block text-gray-700">Priority Level</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg"
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
