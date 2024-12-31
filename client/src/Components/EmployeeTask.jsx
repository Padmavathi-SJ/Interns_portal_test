import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]); // Tasks grouped by date
  const [selectedTask, setSelectedTask] = useState(null); // Task to display in modal
  const [error, setError] = useState("");

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
        const response = await axios.get("http://localhost:3000/auth/get_task", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.Status) {
          // Group tasks by date
          const groupedTasks = response.data.Result.reduce((acc, task) => {
            const date = new Date(task.deadline).toLocaleDateString();
            acc[date] = acc[date] ? [...acc[date], task] : [task];
            return acc;
          }, {});
          setTasks(groupedTasks);
        } else {
          setError(response.data.Message || "No tasks found.");
        }
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching tasks.");
      }
    };

    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/auth/update_task_status/${taskId}`,
        { status: "Completed" }
      );
      if (response.data.Status) {
        setTasks((prevTasks) =>
          Object.fromEntries(
            Object.entries(prevTasks).map(([date, tasks]) => [
              date,
              tasks.map((task) =>
                task.taskId === taskId ? { ...task, status: "Completed" } : task
              ),
            ])
          )
        );
      } else {
        setError("Error updating task status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("An error occurred while updating task status.");
    }
  };

  return (
    <div className="p-6">

      {error && <div className="text-red-500">{error}</div>}

      {Object.entries(tasks).map(([date, taskList]) => (
        <div key={date} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{date}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {taskList.map((task) => (
              <div
                key={task.taskId}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200 w-auto max-w-sm flex flex-col space-y-2"
              >
                <p><strong>Task ID:</strong> {task.taskId}</p>
                <p><strong>Title:</strong> {task.title}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <div className="mt-4 flex space-x-2">
                  {task.status !== "Completed" && (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleStatusChange(task.taskId)}
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setSelectedTask(task)}
                  >
                    View Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

{selectedTask && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 max-w-xl relative">
      <button
        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
        onClick={() => setSelectedTask(null)}
      >
        X
      </button>
      <h3 className="text-xl font-bold mb-4">{selectedTask.title}</h3>
      <div className="flex flex-col space-y-2">
        <p><strong>Description:</strong> {selectedTask.description}</p>
        <p><strong>Deadline:</strong> {new Date(selectedTask.deadline).toLocaleDateString()}</p>
        <p><strong>Priority:</strong> {selectedTask.priority}</p>
        <p><strong>Status:</strong> {selectedTask.status}</p>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default EmployeeTask;
