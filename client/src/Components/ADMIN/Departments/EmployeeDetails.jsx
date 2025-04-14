import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetails = () => {
  const { employeeId } = useParams();  // Get employee_id from URL params
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/admin/get-emp-details/${employeeId}`)
      .then((response) => {
        if (response.data.status) {
        //  console.log("Response: ", response.data);
          setEmployee(response.data.Employee); // Populate employee details
        } else {
          alert('Failed to fetch employee details');
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Error fetching employee details');
      });
  }, [employeeId]);


  
  if (!employee) {
    return <p>Loading employee details...</p>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-4xl mx-auto shadow-xl">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Employee Details</h2>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">{employee.name}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <p className="text-gray-600"><strong>Role:</strong> {employee.role}</p>
          <p className="text-gray-600"><strong>Email:</strong> {employee.email}</p>
          <p className="text-gray-600"><strong>Experience:</strong> {employee.experience} years</p>
          <p className="text-gray-600"><strong>Salary:</strong> ${employee.salary}</p>
          <p className="text-gray-600"><strong>Degree:</strong> {employee.degree}</p>
          <p className="text-gray-600"><strong>University:</strong> {employee.university}</p>
          <p className="text-gray-600"><strong>Graduation Year:</strong> {employee.graduation_year}</p>
          <p className="text-gray-600"><strong>Skills:</strong> {employee.skills}</p>
          <p className="text-gray-600"><strong>Certifications:</strong> {employee.certifications}</p>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
