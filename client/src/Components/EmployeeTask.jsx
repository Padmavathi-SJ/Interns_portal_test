import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeTask = () => {
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  // Function to decode JWT and check expiration
  const isTokenExpired = (token) => {
    const payload = token.split('.')[1]; // Get the payload part of the JWT
    const decoded = JSON.parse(atob(payload)); // Decode base64 URL encoded string
    const currentTime = Date.now() / 1000; // Get current time in seconds
    return decoded.exp < currentTime; // Check if token is expired
  };

  // Function to get the logged-in employee's ID from token
  const getLoggedInEmployeeId = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return null;

    // Decode the JWT to get the payload
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));

    return decoded.id; // Return the 'id' (employee ID) from the JWT payload
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Retrieve token from localStorage
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          setError("Token expired, please log in again.");
          return;
        }

        const loggedInEmployeeId = getLoggedInEmployeeId();

        if (!loggedInEmployeeId) {
          setError("Unable to retrieve employee ID.");
          return;
        }

        // Fetch all tasks
        const response = await axios.get("http://localhost:3000/auth/get_tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.Status) {
          // Ensure response.data.Results exists and is an array before filtering
          if (Array.isArray(response.data.Results)) {
            // Filter tasks based on the logged-in employee's ID
            const employeeTasks = response.data.Results.filter(
              (task) => task.employeeId === loggedInEmployeeId
            );

            if (employeeTasks.length > 0) {
              setTask(employeeTasks[0]); // If tasks exist for this employee, set the first task
            } else {
              setError("No tasks found for the logged-in employee.");
            }
          } else {
            setError("Task data is not available or incorrectly structured.");
          }
        } else {
          setError(response.data.Message || "Unable to fetch tasks.");
        }
      } catch (err) {
        setError("An error occurred while fetching tasks.");
        console.error("Error:", err.response ? err.response.data : err);
      }
    };

    fetchTaskDetails();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-600 p-4 rounded-md shadow-md max-w-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-600 font-semibold">Loading task details...</div>
      </div>
    );
  }

  const { taskId, title, description, deadline, priority, status } = task;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Employee Task</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Task ID:</span>
            <span className="text-gray-600">{taskId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Title:</span>
            <span className="text-gray-600">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Description:</span>
            <span className="text-gray-600">{description}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Deadline:</span>
            <span className="text-gray-600">{new Date(deadline).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Priority:</span>
            <span className="text-gray-600">{priority}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Status:</span>
            <span className="text-gray-600">{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTask;
