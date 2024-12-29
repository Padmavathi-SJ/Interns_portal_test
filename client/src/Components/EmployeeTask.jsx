import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]); // Updated to handle multiple tasks
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook to navigate between routes

  const getLoggedInEmployeeId = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  };

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const employeeId = getLoggedInEmployeeId();
      if (!employeeId) {
        setError("Unable to retrieve employee ID.");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/auth/get_task", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const employeeTasks = response.data.Result || [];
        if (employeeTasks.length > 0) {
          setTasks(employeeTasks);
        } else {
          setError("No tasks found for the logged-in employee.");
        }
      } catch (err) {
        console.error("Error fetching tasks:", err.response || err);
        setError("An error occurred while fetching tasks.");
      }
    };

    fetchTaskDetails();
  }, []);

  const handleStatusChange = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/auth/update_task_status/${taskId}`,
        { status: "completed" }
      );
      if (response.data.Status) {
        setTasks(tasks.map(task => 
          task.taskId === taskId ? { ...task, status: "completed" } : task
        ));
      } else {
        setError("Error updating task status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("An error occurred while updating task status.");
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (tasks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="task-container p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Task Details</h2>
      {tasks.map((task) => (
        <div key={task.taskId} className="bg-white p-4 shadow-md rounded-lg mb-4">
          <p><strong>Task ID:</strong> {task.taskId}</p>
          <p><strong>Title:</strong> {task.title}</p>
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Status:</strong> {task.status}</p>

          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleStatusChange(task.taskId)}
          >
            Mark as Completed
          </button>
        </div>
      ))}
    </div>
  );
};

export default EmployeeTask;
