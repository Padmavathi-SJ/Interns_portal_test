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

  const handleEditDepartment = (departmentId) => {
    navigate(`/admin-dashboard/edit_department/${departmentId}`);
  };

  const handleDeleteDepartment = (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      axios.delete(`http://localhost:3000/auth/delete_department/${departmentId}`)
        .then(response => {
          if (response.data.Status) {
            setDepartments(departments.filter(department => department.id !== departmentId));
            alert('Department deleted successfully');
          } else {
            alert('Failed to delete department');
          }
        })
        .catch(err => {
          console.log(err);
          alert('Error deleting department');
        });
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-blue-700 mb-6">Departments</h2>
      <p className="text-lg mb-6 text-gray-700">Click on a department to view its employees.</p>

      {/* Link to Add New Department */}
      <Link
        to="/admin-dashboard/department/add_department"
        className="inline-block px-8 py-3 mb-6 font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition duration-300 ease-in-out"
      >
        Add New Department
      </Link>

      {/* Grid of Departments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {departments.map((department) => (
          <div
            key={department.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 border border-blue-300"
            onClick={() => handleViewEmployees(department.id)}
          >
            <h3 className="text-xl font-semibold text-blue-700">{department.name}</h3>
            <div className="mt-4 flex justify-between">
              <button
                className="text-blue-700 hover:text-blue-800"
                onClick={(e) => { e.stopPropagation(); handleEditDepartment(department.id); }}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-700"
                onClick={(e) => { e.stopPropagation(); handleDeleteDepartment(department.id); }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Department;
