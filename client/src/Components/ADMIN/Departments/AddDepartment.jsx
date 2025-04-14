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

    axios.post('http://localhost:3000/admin/add-department', { department })
      .then(result => {
        if (result.data.status) {
          navigate('/admin-dashboard/department');
        } else {
          alert(result.data.Error || "Something went wrong.");
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-md mx-auto">
      <h2 className="text-3xl font-semibold text-blue-700 mb-6">Add New Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Department Name</label>
          <input
            type="text"
            name="department"
            value={department}  // Make sure to bind the input value to the state
            onChange={(e) => setDepartment(e.target.value)}  // Update state on change
            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter department name"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800 transition duration-300 ease-in-out"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;
