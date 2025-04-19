import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]); // All tasks excluding today's tasks
  const [todayTasks, setTodayTasks] = useState([]); // Today's tasks
  const [error, setError] = useState("");
  const [showAllTasks, setShowAllTasks] = useState(false); // Toggle for all tasks
  const [selectedTask, setSelectedTask] = useState(null); // Store the selected task for viewing description
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  const getLoggedInEmployeeId = () => {
    const token = localStorage.getItem("userToken");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Decoded payload:", payload);
      return payload.id;
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
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
        const todayResponse = await axios.get(
          "http://localhost:3000/auth/get_today_tasks", 
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Sending token in header:", token);

        if (todayResponse.data.Status) {
          setTodayTasks(todayResponse.data.Result);
        } else {
          setError(todayResponse.data.Message || "No tasks found for today.");
        }

        const allResponse = await axios.get(
          "http://localhost:3000/admin/get_all_tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (allResponse.data.Status) {
          const allTasksExcludingToday = allResponse.data.Result.filter(
            (task) => !todayTasks.some((todayTask) => todayTask.taskId === task.taskId)
          );
          setTasks(allTasksExcludingToday);
        } else {
          setError(allResponse.data.Message || "No tasks found.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching tasks.");
      }
    };

    fetchTasks();
  }, [todayTasks]);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      setError("Unable to retrieve user token. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/auth/update_task_status/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.Status) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === taskId ? { ...task, status: newStatus } : task
          )
        );
        setTodayTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.taskId === taskId ? { ...task, status: newStatus } : task
          )
        );
        setError(""); 
      } else {
        setError("Failed to update task status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("An error occurred while updating the task status.");
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

  return (
    <div>
      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* Today's Task Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">Today's Tasks</h3>
          
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showAllTasks ? "Hide All Tasks" : "View All Tasks"}
          </button>
        </div>

        {/* Today's Task Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {todayTasks.map((task) => {
            return (
              <div
                key={task.taskId}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="flex justify-between items-center mb-3">
                  <p className="text-gray-800 dark:text-gray-200">Task ID: {task.taskId}</p>
                  <p className={`text-lg ${getPriorityStyle(task.priority)}`}>{task.priority}</p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-800 dark:text-gray-300">Status: 
                    <span className={`inline-block px-4 py-2 rounded-lg ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </p>
                  <div className="mt-4 relative">
                  {/* Status Dropdown */}
  <div className="absolute bottom-0 right-0  mr-4">
    <select
      className="p-2 border rounded-md"
      value={task.status}
      onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>
  </div>
                 {/* View Task Button */}
                <div className="mt-4 flex justify-between gap-4">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    onClick={() => handleViewTask(task)}
                  >
                    View Task
                  </button>
                </div>
              </div>
              </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show All Tasks */}
      {showAllTasks && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">All Tasks</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => {
              return (
                <div
                  key={task.taskId}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-gray-800 dark:text-gray-200">Task ID: {task.taskId}</p>
                    <p className={`text-lg ${getPriorityStyle(task.priority)}`}>{task.priority}</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-800 dark:text-gray-300">Status: 
                      <span className={`inline-block px-4 py-2 rounded-lg ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </p>
                    <div className="mt-4 relative">
 

  {/* Status Dropdown */}
  <div className="absolute bottom-0 right-0 mr-4">
    <select
      className="p-2 border rounded-md"
      value={task.status}
      onChange={(e) => handleStatusChange(task.taskId, e.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option>
    </select>
  </div>

  {/* View Task Button */}
  <div className="mt-4 flex justify-between gap-4">
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      onClick={() => handleViewTask(task)}
    >
      View Task
    </button>
  </div>
</div>
</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all transform hover:scale-105">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{selectedTask.title}</h3>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
            <div className="mt-6 text-right">
              <button
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
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

export default EmployeeTask;
