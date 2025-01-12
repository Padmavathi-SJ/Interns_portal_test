import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/auth/get_departments')
      .then((response) => {
        if (response.data.Status) {
          setDepartments(response.data.Result); // Ensure departments is an array
        } else {
          alert('Failed to fetch departments');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Error fetching departments');
      });
  }, []);

  const handleViewEmployees = (departmentId) => {
    navigate(`/admin-dashboard/department/${departmentId}/employees`);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Departments</h2>
      <p className="mb-6">Click on a department to view its employees.</p>

      {/* Link to Add New Department */}
      <Link
        to="/admin-dashboard/department/add_department"
        className="inline-block px-6 py-2 mb-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Add New Department
      </Link>

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map((department) => (
          <div
            key={department.id}
            className="bg-gray-200 p-4 rounded-lg shadow-lg hover:bg-gray-300 cursor-pointer"
            onClick={() => handleViewEmployees(department.id)}
          >
            <h3 className="text-lg font-semibold text-gray-800">{department.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Department;
