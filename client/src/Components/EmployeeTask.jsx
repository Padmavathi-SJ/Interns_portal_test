import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]); // All tasks excluding today's tasks
  const [todayTasks, setTodayTasks] = useState([]); // Today's tasks
  const [error, setError] = useState("");
  const [showAllTasks, setShowAllTasks] = useState(false); // Toggle for all tasks
  const [selectedTask, setSelectedTask] = useState(null); // Store the selected task for viewing description
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  // Helper to extract employee ID
  const getLoggedInEmployeeId = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("userToken");
      const employeeId = getLoggedInEmployeeId();
      if (!token || !employeeId) {
        setError("Unable to retrieve employee tasks. Please log in.");
        return;
      }

      try {
        // Fetch today's tasks
        const todayResponse = await axios.get(
          "http://localhost:3000/auth/get_today_tasks", // Route for today's tasks
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (todayResponse.data.Status) {
          setTodayTasks(todayResponse.data.Result); // Store today's tasks
        } else {
          setError(todayResponse.data.Message || "No tasks found for today.");
        }

        // Fetch all tasks excluding today's tasks
        const allResponse = await axios.get(
          "http://localhost:3000/auth/get_all_tasks", // Route for past tasks (excluding today's)
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (allResponse.data.Status) {
          // Filter out today's tasks from all tasks
          const allTasksExcludingToday = allResponse.data.Result.filter(
            (task) => !todayTasks.some((todayTask) => todayTask.taskId === task.taskId)
          );
          setTasks(allTasksExcludingToday); // Store all tasks excluding today
        } else {
          setError(allResponse.data.Message || "No tasks found.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching tasks.");
      }
    };

    fetchTasks();
  }, [todayTasks]); // Adding `todayTasks` to dependency to ensure filtering works correctly

  // Function to handle opening the view task modal
  const handleViewTask = (task) => {
    setSelectedTask(task); // Store selected task to show its description
    setIsModalOpen(true); // Open the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setSelectedTask(null); // Clear selected task
  };

  // Function to handle status change to "Completed"
  const handleStatusChange = async (taskId) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Unable to retrieve user token. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/auth/update_task_status/${taskId}`,
        { status: "Completed" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.Status) {
        // Update the status in local state to reflect the change immediately
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === taskId ? { ...task, status: "Completed" } : task
          )
        );
        setTodayTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === taskId ? { ...task, status: "Completed" } : task
          )
        );
        setError(""); // Clear error if the update was successful
      } else {
        setError("Failed to update task status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("An error occurred while updating the task status.");
    }
  };

  // Helper to determine button color based on priority
  const getPriorityButtonStyle = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="p-6">
      {error && <div className="text-red-500">{error}</div>}

      {/* Today's Task Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-300">Today's Tasks</h3>
          
          {/* "View All" Button */}
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAllTasks ? "View Today's Tasks" : "View All Tasks"}
          </button>
        </div>

        {/* Task Cards for Today's Tasks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todayTasks.map((task) => {
            return (
              <div
                key={task.taskId}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 dark:border-gray-600 border-gray-300 flex flex-col"
              >
                <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{task.title}</h4>
                <div className="mt-2 flex flex-col space-y-2">
                  <p className="text-gray-600 dark:text-gray-400">Task ID: {task.taskId}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Priority: 
                    <button
                      className={`px-4 py-2 rounded-full text-sm font-semibold mt-2 ${getPriorityButtonStyle(task.priority)}`}
                    >
                      {task.priority}
                    </button>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Status: {task.status}</p>
                </div>
                <div className="mt-4 flex justify-between">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleViewTask(task)} // Open modal with task description
                  >
                    View Task
                  </button>
                  {task.status !== "Completed" && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleStatusChange(task.taskId)} // Mark as completed
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show All Tasks if "View All" is toggled */}
      {showAllTasks && (
        <div>
          <h3 className="text-lg font-bold mb-2 text-blue-600 dark:text-blue-300">All Tasks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              return (
                <div
                  key={task.taskId}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 dark:border-gray-600 border-gray-300 flex flex-col"
                >
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{task.title}</h4>
                  <div className="mt-2 flex flex-col space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">Task ID: {task.taskId}</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Priority: 
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-semibold mt-2 ${getPriorityButtonStyle(task.priority)}`}
                      >
                        {task.priority}
                      </button>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">Status: {task.status}</p>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleViewTask(task)} // Open modal with task description
                    >
                      View Task
                    </button>
                    {task.status !== "Completed" && (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={() => handleStatusChange(task.taskId)} // Mark as completed
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal for Viewing Task Description */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 border-2 dark:border-gray-600 border-gray-300">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Task Description</h3>
              <button
                className="text-red-500"
                onClick={handleCloseModal} // Close the modal
              >
                Close
              </button>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTask;
