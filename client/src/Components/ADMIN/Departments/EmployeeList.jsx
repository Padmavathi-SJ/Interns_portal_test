import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const { departmentId } = useParams();  // Get department_id from URL params
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/get_employees_by_department/${departmentId}`)
      .then((response) => {
        if (response.data.Status) {
          setEmployees(response.data.Result); // Populate employees
          setFilteredEmployees(response.data.Result); // Initially, all employees are displayed
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-blue-700 mb-4">Interns in this Department</h2>
      <p className="mb-6">Here is a list of interns in this department.</p>

      {/* Search Box */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search employees by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 w-full md:w-1/3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Employees Table */}
      {filteredEmployees.length > 0 ? (
        <table className="min-w-full table-auto mb-6 bg-white shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 text-blue-700">
            <tr>
              <th className="px-4 py-2 text-left">Employee ID</th>
              <th className="px-4 py-2 text-left">Employee Name</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Experience</th>
              <th className="px-4 py-2 text-left">Salary</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-indigo-50 transition-colors">
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
