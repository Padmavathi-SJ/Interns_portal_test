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
        `http://localhost:3000/update_task_status/${taskId}`,
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

  return (
    <div className="p-6">
      {error && <div className="text-red-500">{error}</div>}

      {/* Today's Task Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Today's Tasks</h3>
          
          {/* "View All" Button */}
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showAllTasks ? "View Today's Tasks" : "View All Tasks"}
          </button>
        </div>

        {/* Table for Today's Tasks */}
        <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg mb-6">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="px-4 py-2 text-left">Task ID</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {todayTasks.map((task) => {
              const priorityStyles = {
                high: "bg-red-500 text-white animate-pulse",
                medium: "bg-yellow-500 text-white",
                low: "bg-green-500 text-white",
              };
              return (
                <tr key={task.taskId} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{task.taskId}</td>
                  <td className="px-4 py-2">{task.title}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityStyles[task.priority.toLowerCase()]}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-2">{task.status}</td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleViewTask(task)} // Open modal with task description
                    >
                      View Task
                    </button>
                    {task.status !== "Completed" && (
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
                        onClick={() => handleStatusChange(task.taskId)} // Mark as completed
                      >
                        Mark as Completed
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Show All Tasks if "View All" is toggled */}
      {showAllTasks && (
        <div>
          <h3 className="text-lg font-bold mb-2">All Tasks</h3>
          <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="px-4 py-2 text-left">Task ID</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                return (
                  <tr key={task.taskId} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{task.taskId}</td>
                    <td className="px-4 py-2">{task.title}</td>
                    <td className="px-4 py-2">{task.priority}</td>
                    <td className="px-4 py-2">{task.status}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={() => handleViewTask(task)} // Open modal with task description
                      >
                        View Task
                      </button>
                      {task.status !== "Completed" && (
                        <button
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-2"
                          onClick={() => handleStatusChange(task.taskId)} // Mark as completed
                        >
                          Mark as Completed
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Viewing Task Description */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Task Description</h3>
              <button
                className="text-red-500"
                onClick={handleCloseModal} // Close the modal
              >
                Close
              </button>
            </div>
            <p className="mt-4">{selectedTask.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTask;
