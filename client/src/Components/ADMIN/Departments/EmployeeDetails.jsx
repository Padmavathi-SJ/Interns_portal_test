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

  const handleResumeClick = () => {
    if (employee.resume) {
      // Assuming employee.resume contains the path to the resume file
      window.open(`http://localhost:3000/uploads/resumes/${employee.resume}`, '_blank');
    } else {
      alert('No resume available for this employee');
    }
  };

  if (!employee) {
    return <p>Loading intern details...</p>;
  }

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-4xl mx-auto shadow-xl">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Intern Details</h2>

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
          {employee.resume && (
            <button
              onClick={handleResumeClick}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              View Resume
            </button>
          )}
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
