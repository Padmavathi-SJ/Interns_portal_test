import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    title: "",
    description: "",
    deadline: "",
    priority: "Low",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/get_employees")
      .then((response) => {
        if (response.data.Status) {
          setEmployees(response.data.Result);
        } else {
          setMessage("Failed to fetch employees");
        }
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setMessage("Error fetching employees");
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.employee_id || !formData.title || !formData.deadline) {
      setMessage("Please fill all the required fields");
      return;
    }

    axios
      .post("http://localhost:3000/auth/allocate_work", formData)
      .then((response) => {
        if (response.data.Status) {
          window.alert("Work allocated successfully!");
          setMessage("");
          setFormData({
            employee_id: "",
            title: "",
            description: "",
            deadline: "",
            priority: "Low",
          });
          navigate('/admin-dashboard/work_allocation');
        } else {
          setMessage(response.data.Error || "Failed to allocate work");
        }
      })
      .catch((error) => {
        console.error("Error allocating work:", error);
        setMessage("Error allocating work");
      });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Allocate Work</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Employee</label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            required
          >
            <option value="">-- Select Employee --</option>
            {employees.map((employee) => (
              <option key={employee.employeeId} value={employee.employeeId}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-indigo-600"
        >
          Allocate Work
        </button>
      </form>
    </div>
  );
};

export default AddTask;
