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
  const [currentPageTasks, setCurrentPageTasks] = useState(1);
  const [currentPageTeamTasks, setCurrentPageTeamTasks] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const tasksPerPage = 7;

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
    setTaskToDelete({ type: "individual", taskId });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteTeamTask = (taskId) => {
    setTaskToDelete({ type: "team", taskId });
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = () => {
    if (taskToDelete.type === "individual") {
      axios.delete(`http://localhost:3000/auth/delete_task/${taskToDelete.taskId}`)
        .then((response) => {
          if (response.data.Status) {
            setTasks(tasks.filter((task) => task.taskId !== taskToDelete.taskId));
          } else {
            console.error("Error deleting task:", response.data.Error);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    } else {
      axios.delete(`http://localhost:3000/auth/delete_team_task/${taskToDelete.taskId}`)
        .then((response) => {
          if (response.data.Status) {
            setTeamTasks(teamTasks.filter((task) => task.taskId !== taskToDelete.taskId));
          } else {
            console.error("Error deleting team task:", response.data.Error);
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setTaskToDelete(null);
  };

  const handleEdit = (taskId) => {
    navigate(`/admin-dashboard/edit_work/${taskId}`);
  };

  const handleEditTeamTask = (taskId) => {
    navigate(`/admin-dashboard/edit_team_work/${taskId}`);
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
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-500';
      case 'in progress':
        return 'text-yellow-500';
      case 'pending':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredTasks = tasks.filter((task) =>
      task.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      task.employee_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    const filteredTeamTasks = teamTasks.filter((task) =>
      task.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
      task.team_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setTasks(filteredTasks);
    setTeamTasks(filteredTeamTasks);
  };

  const totalTasksPages = Math.ceil(tasks.length / tasksPerPage);
  const totalTeamTasksPages = Math.ceil(teamTasks.length / tasksPerPage);

  const handlePageChangeTasks = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalTasksPages) {
      setCurrentPageTasks(pageNumber);
    }
  };

  const handlePageChangeTeamTasks = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalTeamTasksPages) {
      setCurrentPageTeamTasks(pageNumber);
    }
  };

  const paginateTasks = (tasks) => {
    const startIndex = (currentPageTasks - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return tasks.slice(startIndex, endIndex);
  };

  const paginateTeamTasks = (teamTasks) => {
    const startIndex = (currentPageTeamTasks - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return teamTasks.slice(startIndex, endIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-700">Work Assignments</h2>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-3 w-full border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>
      </div>

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

      <div className="flex space-x-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-4 w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Assigned Individual Tasks</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-1 px-2">Task ID</th>
                <th className="py-1 px-2">Employee</th>
                <th className="py-1 px-2">Deadline</th>
                <th className="py-1 px-2">Priority</th>
                <th className="py-1 px-2">Status</th>
                <th className="py-1 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginateTasks(tasks).map((task) => (
                <tr key={task.taskId}>
                  <td className="py-1 px-2">{task.taskId}</td>
                  <td className="py-1 px-2">{task.employee_name}</td>
                  <td className="py-1 px-2">{formatDate(task.deadline)}</td>
                  <td className={`py-1 px-2 ${getPriorityClass(task.priority)}`}>{task.priority}</td>
                  <td className={`py-1 px-2 ${getStatusClass(task.status)}`}>{task.status}</td>
                  <td className="py-1 px-2">
                    <button onClick={() => handleViewTask(task)} className="text-blue-500">View</button>
                    <button onClick={() => handleEdit(task.taskId)} className="text-yellow-500 mx-1"><FaEdit /></button>
                    <button onClick={() => handleDelete(task.taskId)} className="text-red-500"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            {Array.from({ length: totalTasksPages }).map((_, index) => (
              <button key={index + 1} onClick={() => handlePageChangeTasks(index + 1)} className={`px-3 py-1 mx-1 ${currentPageTasks === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 w-full">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Assigned Team Tasks</h2>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-1 px-2">Task ID</th>
                <th className="py-1 px-2">Team</th>
                <th className="py-1 px-2">Deadline</th>
                <th className="py-1 px-2">Priority</th>
                <th className="py-1 px-2">Status</th>
                <th className="py-1 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginateTeamTasks(teamTasks).map((task) => (
                <tr key={task.taskId}>
                  <td className="py-1 px-2">{task.taskId}</td>
                  <td className="py-1 px-2">{task.team_name}</td>
                  <td className="py-1 px-2">{formatDate(task.deadline)}</td>
                  <td className={`py-1 px-2 ${getPriorityClass(task.priority)}`}>{task.priority}</td>
                  <td className={`py-1 px-2 ${getStatusClass(task.status)}`}>{task.status}</td>
                  <td className="py-1 px-2">
                    <button onClick={() => handleViewTask(task)} className="text-blue-500">View</button>
                    <button onClick={() => handleEditTeamTask(task.taskId)} className="text-yellow-500 mx-1"><FaEdit /></button>
                    <button onClick={() => handleDeleteTeamTask(task.taskId)} className="text-red-500"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            {Array.from({ length: totalTeamTasksPages }).map((_, index) => (
              <button key={index + 1} onClick={() => handlePageChangeTeamTasks(index + 1)} className={`px-3 py-1 mx-1 ${currentPageTeamTasks === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{selectedTask.title}</h2>
            <p className="mb-4">{selectedTask.description}</p>
            <div className="flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkAllocation;
