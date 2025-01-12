import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Employee = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch employees from the server
    axios
      .get("http://localhost:3000/auth/get_employees")
      .then((response) => {
        if (response.data.Status) {
          setEmployees(response.data.Result); // Set employees data
        } else {
          alert("Failed to fetch employees");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error fetching employees");
      });
  }, []);

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      axios
        .delete(`http://localhost:3000/auth/delete_employee/${employeeId}`)
        .then((response) => {
          if (response.data.Status) {
            alert('Employee deleted successfully');
            // Re-fetch the employee list after deletion
            axios
              .get('http://localhost:3000/auth/get_employees')
              .then((response) => {
                if (response.data.Status) {
                  setEmployees(response.data.Result); // Set updated employees data
                } else {
                  alert('Failed to fetch employees');
                }
              })
              .catch((err) => {
                console.error(err);
                alert('Error fetching employees');
              });
          } else {
            alert('Failed to delete employee');
          }
        })
        .catch((err) => {
          console.error(err);
          alert('Error deleting employee');
        });
    }
  };

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

      {/* Employees Table */}
      {employees.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-gray-600">Employee ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Department</th>
              <th className="px-4 py-2 text-left text-gray-600">Role</th>
              <th className="px-4 py-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeId} className="border-b">
                <td className="px-4 py-2 text-gray-800">{employee.employeeId}</td>
                <td className="px-4 py-2 text-gray-800">{employee.name}</td>
                <td className="px-4 py-2 text-gray-800">{employee.department}</td>
                <td className="px-4 py-2 text-gray-800">{employee.role}</td>
                <td className="px-4 py-2">
                  {/* Link to Edit Employee page */}
                  <Link
                    to={`/admin-dashboard/employee/edit_employee/${employee.employeeId}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    className="ml-4 text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(employee.employeeId)} // Call handleDelete
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees available.</p>
      )}
    </div>
  );
};

export default Employee;
