import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetails = () => {
  const { employeeId } = useParams();  // Get employee_id from URL params
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/auth/get_employee_details/${employeeId}`)
      .then((response) => {
        if (response.data.Status) {
          setEmployee(response.data.Result); // Populate employee details
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
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employee Details</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{employee.name}</h3>
        <p className="text-gray-600">Role: {employee.role}</p>
        <p className="text-gray-600">Email: {employee.email}</p>
        <p className="text-gray-600">Experience: {employee.experience} years</p>
        <p className="text-gray-600">Salary: ${employee.salary}</p>
        <p className="text-gray-600">Degree: {employee.degree}</p>
        <p className="text-gray-600">University: {employee.university}</p>
        <p className="text-gray-600">Graduation Year: {employee.graduation_year}</p>
        <p className="text-gray-600">Skills: {employee.skills}</p>
        <p className="text-gray-600">Certifications: {employee.certifications}</p>
      </div>
    </div>
  );
};

export default EmployeeDetails;
