import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ProfileImg from "../../../assets/profile.jpg";

const Profile = () => {
  const { employeeId } = useParams(); // Retrieve employeeId from route
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Retrieve token from localStorage
        if (!token) {
          setError("No token found, please log in.");
          return;
        }
        // Fetch employee details
        const response = await axios.get("http://localhost:3000/user/about_employee", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status) {
          setEmployeeDetails(response.data.EmployeeDetails[0]); // Set the employee details
        } else {
          setError(response.data.Message || "Unable to fetch employee details");
        }
      } catch (err) {
        setError("An error occurred while fetching employee details");
        console.error("Error:", err.response ? err.response.data : err);
      }
    };

    fetchEmployeeDetails();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-600 p-4 rounded-md shadow-md max-w-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!employeeDetails) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const {
    id,
    name,
    department,
    role,
    degree,
    experience,
    mobile_no,
    skills,
    university,
  } = employeeDetails;

  const formattedSkills = skills ? skills.split("\r\n").map(skill => skill.trim()).join(", ") : "N/A";

  return (
    <div className="flex flex-col justify-start items-start p-4 w-full ">
      <div className="flex flex-col md:flex-row w-full max-w-4xl space-x-6">

<img src={ProfileImg} alt="Profile" className="w-40 h-13 rounded-full " />

        {/* Employee Details */}
        <div className="flex flex-col w-full text-gray-600 dark:text-gray-200">
          <div className="flex flex-col space-y-2">

            <p><span>12345678IT{id}</span></p>
            <p><span>{name}</span></p>
            <p><span>{department}</span></p>
            <p><span>{role}</span></p>

          </div>
        </div>
      </div>

      {/* Remaining Details */}
      <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-4 w-full -mt-4">
        <div className="flex flex-col space-y-2">
          <p><span>Degree: {degree}</span></p>
          <p><span>University: {university}</span></p>
          <p><span>Experience: {experience} years</span></p>
          <p><span>Mobile no: {mobile_no}</span></p>
          <p><span>High Skills: {formattedSkills}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
