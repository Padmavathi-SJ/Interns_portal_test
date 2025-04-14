import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Employee = ({ isSidebarOpen }) => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const employeesPerPage = 10;

  useEffect(() => {
    // Fetch employees from the server once
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/get-employees", {
          params: {
            limit: 1000, // Fetch a large enough number to handle search client-side
          },
        });

        if (response.data.status) {
          setEmployees(response.data.Employees);
          setTotalEmployees(response.data.Employees.length); // Total number of employees
          setFilteredEmployees(response.data.Employees); // Initially, all employees are displayed
        } else {
          alert("Failed to fetch employees");
        }
      } catch (err) {
        console.error(err);
        alert("Error fetching employees");
      }
    };

    fetchEmployees();
  }, []);

  const handleDelete = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`http://localhost:3000/auth/delete_employee/${employeeId}`)
        .then((response) => {
          if (response.data.Status) {
            alert("Employee deleted successfully");
            setEmployees((prev) => prev.filter((employee) => employee.employeeId !== employeeId));
            setFilteredEmployees((prev) => prev.filter((employee) => employee.employeeId !== employeeId));
          } else {
            alert("Failed to delete employee");
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Error deleting employee");
        });
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Filter employees based on name locally
    const filtered = employees.filter((employee) =>
      employee.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page on search change
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentEmployees = filteredEmployees.slice(
    (currentPage - 1) * employeesPerPage,
    currentPage * employeesPerPage
  );

  return (
    <div className={`p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-8xl mx-auto transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
      <h2 className="text-3xl font-semibold text-blue-700 mb-4">Here is a list of all Interns</h2>

      {/* Search Box */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search employees by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 w-full md:w-1/3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <Link
          to="/admin-dashboard/employee/add_employee"
          className="inline-block px-6 py-2 ml-4 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-700"
        >
          Add New Intern
        </Link>
      </div>

      {/* Employees Table */}
      {currentEmployees.length > 0 ? (
        <table className="min-w-full table-auto mb-6 bg-white shadow-lg rounded-lg">
          <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 text-blue-700">
            <tr>
              <th className="px-4 py-2 text-left">Employee ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee) => (
              <tr key={employee.employeeId} className="border-b hover:bg-indigo-50 transition-colors">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md mr-2 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-700 text-white rounded-md ml-2 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Employee;
