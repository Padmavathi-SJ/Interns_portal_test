import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTeamTask = () => {
  const { taskId } = useParams();  // Get the task ID from the URL
  const navigate = useNavigate();  // To navigate after updating the task

  // State to store task details
  const [task, setTask] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: 'Low',  // Default value
    status: 'Pending',  // Default value
  });

  // Fetch task details when component loads
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/get_team_task/${taskId}`);  // API to fetch task by ID
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task details:', error);
      }
    };

    fetchTask();
  }, [taskId]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Handle form submission (update task)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:3000/auth/edit_team_task/${taskId}`, task);  // API to update task
      console.log('Task updated successfully:', response.data);
      navigate('/admin-dashboard/work_allocation');  // Navigate to tasks list after successful update
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Team Task</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Task Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={task.title}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={task.description}
                onChange={handleChange}
                required
                rows="4"
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={task.deadline}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                id="priority"
                name="priority"
                value={task.priority}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                name="status"
                value={task.status}
                onChange={handleChange}
                required
                className="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                Update Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTeamTask;
