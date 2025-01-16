import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EmployeeTeamWork = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [selectedTask, setSelectedTask] = useState(null); // Track selected task for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false); // Dropdown visibility for update status
  const [statusToUpdate, setStatusToUpdate] = useState(""); // Store selected status for updating task
  const { teamId } = useParams(); // Get team ID from the URL

  useEffect(() => {
    const fetchTeamTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/get_team_tasks/${teamId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, // Add token for authentication
          }
        );

        if (response.data.Status) {
          setTasks(response.data.Result);
        } else {
          setMessage(response.data.Message);
        }
      } catch (err) {
        console.error("Error fetching team tasks:", err);
        setMessage("Error fetching tasks. Please try again.");
      }
    };

    fetchTeamTasks();
  }, [teamId]);

  // Handle updating the task status
  const handleStatusUpdate = async (taskId) => {
    if (!statusToUpdate) return; // Don't proceed if no status selected
    try {
      const response = await axios.put(
        `http://localhost:3000/auth/update_team_task_status/${teamId}/${taskId}`,
        { status: statusToUpdate },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        }
      );

      if (response.data.Status) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: statusToUpdate } : task
          )
        );
        setMessage("Task status updated successfully.");
        setStatusToUpdate(""); // Reset status after update
      } else {
        setMessage(response.data.Message);
      }
    } catch (err) {
      console.error("Error updating task status:", err);
      setMessage("Error updating task status. Please try again.");
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-500 font-semibold";
      case "medium":
        return "text-yellow-500 font-semibold";
      case "low":
        return "text-green-500 font-semibold";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-blue-500";
      case "Completed":
        return "text-green-500";
      case "Pending":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  // Open the modal for a specific task
  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-center text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
        Team Tasks
      </h2>
      {message && <p className="text-red-500 text-center mb-4">{message}</p>}
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-800 dark:text-gray-200">Task ID: {task.id}</p>
                <p className={`text-lg ${getPriorityStyle(task.priority)}`}>{task.priority}</p>
              </div>
              <p className="text-gray-800 dark:text-gray-300 mb-1">Status: 
                <span className={`inline-block px-3 py-1 rounded-lg ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </p>
              <p className="text-gray-800 dark:text-gray-300 mb-1">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>

              <div className="mt-3 flex gap-2">
                {/* View Task Button */}
                <button
                  className="w-1/2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  onClick={() => handleViewTask(task)}
                >
                  View Task
                </button>

                {/* Dropdown for updating status */}
                <div className="relative w-1/2">
                  <button
                    onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                    className="w-full py-2 bg-white dark:bg-gray-800 text-gray-700 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    Update Status
                  </button>

                  {statusDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <button
                        onClick={() => {
                          setStatusToUpdate("Completed");
                          setStatusDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-green-500 hover:bg-green-100"
                        role="menuitem"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => {
                          setStatusToUpdate("In Progress");
                          setStatusDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-blue-500 hover:bg-blue-100"
                        role="menuitem"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => {
                          setStatusToUpdate("Pending");
                          setStatusDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-100"
                        role="menuitem"
                      >
                        Pending
                      </button>
                    </div>
                  )}

                </div>

                {/* Button to update the task status */}
                {statusToUpdate && (
                  <button
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    onClick={() => handleStatusUpdate(task.id)}
                  >
                    Mark as {statusToUpdate}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !message && <p className="text-center text-gray-500">No tasks found.</p>
      )}

      {/* Modal to View Task */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{selectedTask.title}</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTeamWork;
