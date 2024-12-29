import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const { departmentId } = useParams();  // Get department_id from URL params
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/get_employees_by_department/${departmentId}`)
      .then((response) => {
        if (response.data.Status) {
          setEmployees(response.data.Result); // Populate employees
        } else {
          alert('Failed to fetch employees');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Error fetching employees');
      });
  }, [departmentId]);

  const handleViewDetails = (employeeId) => {
    navigate(`/admin-dashboard/employee/${employeeId}/details`);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employees in Department</h2>
      <p className="mb-6">Here is a list of employees in this department.</p>

      {/* Employee List Table */}
      {employees.length > 0 ? (
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left text-gray-600">Employee ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Employee Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Role</th>
              <th className="px-4 py-2 text-left text-gray-600">Experience</th>
              <th className="px-4 py-2 text-left text-gray-600">Salary</th>
              <th className="px-4 py-2 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b">
                <td className="px-4 py-2 text-gray-800">{employee.id}</td>
                <td className="px-4 py-2 text-gray-800">{employee.name}</td>
                <td className="px-4 py-2 text-gray-800">{employee.role}</td>
                <td className="px-4 py-2 text-gray-800">{employee.experience} years</td>
                <td className="px-4 py-2 text-gray-800">${employee.salary}</td>
                <td className="px-4 py-2">
                  <button
                    className="text-indigo-600 hover:text-indigo-800"
                    onClick={() => handleViewDetails(employee.id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees available in this department.</p>
      )}
    </div>
  );
};

export default EmployeeList;
