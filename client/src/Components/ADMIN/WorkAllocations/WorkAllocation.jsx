import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTasks, FaTrash, FaEdit, FaUsers } from "react-icons/fa";
import axios from "axios";

const WorkAllocation = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = () => {
    axios.get("http://localhost:3000/auth/get_tasks")
      .then((response) => {
        if (response.data.Status) {
          setTasks(response.data.Result);
        } else {
          console.error("Error fetching tasks:", response.data.Error);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const fetchTeamTasks = () => {
    axios.get("http://localhost:3000/auth/get_team_tasks")
      .then((response) => {
        if (response.data.Status) {
          setTeamTasks(response.data.Result);
        } else {
          console.error("Error fetching team tasks:", response.data.Error);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  useEffect(() => {
    fetchTasks();
    fetchTeamTasks();
    const intervalId = setInterval(() => {
      fetchTasks();
      fetchTeamTasks();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleNavigation = () => {
    navigate("/admin-dashboard/allocate_work");
  };

  const handleTeamNavigation = () => {
    navigate("/admin-dashboard/team_work_allocation");
  };

  const handleDelete = (taskId) => {
    axios.delete(`http://localhost:3000/auth/delete_task/${taskId}`)
      .then((response) => {
        if (response.data.Status) {
          setTasks(tasks.filter((task) => task.taskId !== taskId));
        } else {
          console.error("Error deleting task:", response.data.Error);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
      });
  };

  const handleEdit = (taskId) => {
    navigate(`/admin-dashboard/edit_work/${taskId}`);
  };

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in progress':
        return 'bg-yellow-500 text-white';
      case 'pending':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-black';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <h2 className="text-3xl font-semibold text-blue-700 mb-6">Work Assignments</h2>

      {/* Left Column: Individual Task Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4" onClick={handleNavigation}>
          <div className="p-4 bg-blue-200 rounded-full">
            <FaTasks className="text-3xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Allocate Work</h2>
            <p className="text-gray-600">Assign tasks to individual employees.</p>
          </div>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4" onClick={handleTeamNavigation}>
          <div className="p-4 bg-blue-300 rounded-full">
            <FaUsers className="text-3xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Allocate Team Work</h2>
            <p className="text-gray-600">Assign tasks to a team.</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-6">
        {/* Individual Tasks Table */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Individual Tasks</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4">Task ID</th>
                <th className="py-2 px-4">Employee</th>
                <th className="py-2 px-4">Deadline</th>
                <th className="py-2 px-4">Priority</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.taskId}>
                  <td className="py-2 px-4">{task.taskId}</td>
                  <td className="py-2 px-4">{task.employee_name}</td>
                  <td className="py-2 px-4">{formatDate(task.deadline)}</td>
                  <td className={`py-2 px-4 ${getPriorityClass(task.priority)}`}>{task.priority}</td>
                  <td className={`py-2 px-4 ${getStatusClass(task.status)}`}>{task.status}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleViewTask(task)} className="bg-blue-500 text-white rounded p-2">View</button>
                    <button onClick={() => handleEdit(task.taskId)} className="bg-yellow-500 text-white rounded p-2 mx-1"><FaEdit /></button>
                    <button onClick={() => handleDelete(task.taskId)} className="bg-red-500 text-white rounded p-2"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Team Tasks Table */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Team Tasks</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-2 px-4">Task ID</th>
                <th className="py-2 px-4">Team Name</th>
                <th className="py-2 px-4">Deadline</th>
                <th className="py-2 px-4">Priority</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {teamTasks.map((task) => (
                <tr key={task.taskId}>
                  <td className="py-2 px-4">{task.taskId}</td>
                  <td className="py-2 px-4">{task.team_name}</td>
                  <td className="py-2 px-4">{formatDate(task.deadline)}</td>
                  <td className={`py-2 px-4 ${getPriorityClass(task.priority)}`}>{task.priority}</td>
                  <td className={`py-2 px-4 ${getStatusClass(task.status)}`}>{task.status}</td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleViewTask(task)} className="bg-blue-500 text-white rounded p-2">View</button>
                    <button onClick={() => handleEdit(task.taskId)} className="bg-yellow-500 text-white rounded p-2 mx-1"><FaEdit /></button>
                    <button onClick={() => handleDelete(task.taskId)} className="bg-red-500 text-white rounded p-2"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to View Task Details */}
      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-2xl font-semibold mb-4">{selectedTask.title}</h3>
            <p className="mb-4">{selectedTask.description}</p>
            <div className="mt-4 flex justify-end">
              <button onClick={closeModal} className="bg-red-500 text-white p-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkAllocation;
