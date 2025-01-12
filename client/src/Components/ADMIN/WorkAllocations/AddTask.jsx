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
    // Fetch the list of employees
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
  
    // Validate the form
    if (!formData.employee_id || !formData.title || !formData.deadline) {
      setMessage("Please fill all the required fields");
      return;
    }
  
    // Send the work allocation data to the server
    axios
      .post("http://localhost:3000/auth/allocate_work", formData)
      .then((response) => {
        if (response.data.Status) {
          // Show a success alert
          window.alert("Work allocated successfully!");
  
          // Clear form data and navigate back to the work allocation page
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
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Allocate Work</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Select Employee</label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
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
          <label className="block text-gray-600 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter task description"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Allocate Work
        </button>
      </form>
    </div>
  );
};

export default AddTask;
