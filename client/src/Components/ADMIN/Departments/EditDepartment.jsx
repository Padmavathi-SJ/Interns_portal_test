import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditDepartment = () => {
  const [departmentName, setDepartmentName] = useState("");
  const { departmentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/admin/get-department/${departmentId}`)
      .then(response => {
        console.log(response.data); // Add a log to see the actual structure of the response
        if (response.data.status) {
          setDepartmentName(response.data.Department.name);  // Check if 'Result' contains 'name'
        } else {
          alert('Failed to fetch department');
        }
      })
      .catch(err => {
        console.log(err);
        alert('Error fetching department');
      });
  }, [departmentId]);
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!departmentName.trim()) {
      alert("Department name cannot be empty!");
      return;
    }

    axios.put(`http://localhost:3000/admin/edit-department/${departmentId}`, { name: departmentName })
      .then(result => {
        if (result.data.status) {
          navigate('/admin-dashboard/department');
        } else {
          alert('Failed to update department');
        }
      })
      .catch(err => {
        console.log(err);
        alert('Error updating department');
      });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Edit Department</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700">Department Name</label>
          <input
            type="text"
            name="department"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter new department name"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800"
        >
          Update Department
        </button>
      </form>
    </div>
  );
};

export default EditDepartment;
