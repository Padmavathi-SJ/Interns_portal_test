import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddDepartment = () => {
  const [department, setDepartment] = useState("");  // Initialize as an empty string
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the department value is empty
    if (!department.trim()) {
      alert("Department name cannot be empty!");
      return;
    }

    axios.post('http://localhost:3000/auth/add_department', { department })
      .then(result => {
        if (result.data.Status) {
          navigate('/admin-dashboard/department');
        } else {
          alert(result.data.Error || "Something went wrong.");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Department Name</label>
          <input
            type="text"
            name="department"
            value={department}  // Make sure to bind the input value to the state
            onChange={(e) => setDepartment(e.target.value)}  // Update state on change
            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter department name"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
