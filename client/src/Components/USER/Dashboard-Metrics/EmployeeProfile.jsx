import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileImg from "../../../assets/profile.jpg";

const EmployeeProfile = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employee details based on employee_id from JWT token
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("userToken");  // Retrieve the token from localStorage
        if (!token) {
          setError("Unauthorized access. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3000/user/user_details", {
          headers: {
            Authorization: `Bearer ${token}`,  // Send the token with the request
          },
        });

        setEmployee(response.data.EmployeeDetails);  // Set the fetched employee data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee details:", error);
        setError("Error fetching employee details");
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-100">{error}</div>;
  }

  return (
    <div>
      <div>
        {/* Grid Layout with two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Profile Image and First Half of Details */}
          <div className="space-y-6">

          <img src={ProfileImg} alt="Profile" className="w-40 h-13 rounded-full" />

            {/* Employee Details for Left Column */}
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-gray-600 dark:text-gray-400">Name</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{employee.name}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 dark:text-gray-400">Email</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{employee.email}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 dark:text-gray-400">Role</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{employee.role}</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 dark:text-gray-400">Experience</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{employee.experience} years</p>
              </div>

              <div className="flex flex-col">
                <label className="text-gray-600 dark:text-gray-400">Mobile No</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{employee.mobile_no}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Second Half of Details */}
          <div className="space-y-6">
            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400">Department</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{employee.department}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400">Salary</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{employee.salary} USD</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400">Degree</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{employee.degree}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400">University</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{employee.university}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400">Graduation Year</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{employee.graduation_year}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400">Skills</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{employee.skills}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 dark:text-gray-400">Certifications</label>
              <p className="text-lg text-gray-800 dark:text-gray-200">{employee.certifications}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
