import React from 'react';
import { Link } from 'react-router-dom';

const Employee = () => {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employees</h2>
      <p className="mb-6">Here is a list of all employees...</p>

      {/* Link Button to Add New Employee */}
      <Link
        to="/admin-dashboard/employee/add_employee"
        className="inline-block px-6 py-2 mb-4 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        Add New Employee
      </Link>

      {/* List of employees will go here */}
      
    </div>
  );
};

export default Employee;
