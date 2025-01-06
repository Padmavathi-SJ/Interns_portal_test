import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // <-- Correctly imported
import profile from "../assets/profile.jpg"; // Import the default profile picture

const Profile = () => {
  const { employeeId } = useParams(); // Retrieve employeeId from route
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [error, setError] = useState("");

  // Function to decode JWT and check expiration
  const isTokenExpired = (token) => {
    const payload = token.split('.')[1]; // Get the payload part of the JWT
    const decoded = JSON.parse(atob(payload)); // Decode base64 URL encoded string
    const currentTime = Date.now() / 1000; // Get current time in seconds
    return decoded.exp < currentTime; // Check if token is expired
  };

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Retrieve token from localStorage
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        // Check if token is expired
        if (isTokenExpired(token)) {
          setError("Token expired, please log in again.");
          return;
        }

        // Fetch employee details
        const response = await axios.get("http://localhost:3000/auth/get_employee", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.Status) {
          setEmployeeDetails(response.data.Data); // Set the employee details
        } else {
          setError(response.data.Message || "Unable to fetch employee details");
        }
      } catch (err) {
        setError("An error occurred while fetching employee details");
        console.error("Error:", err.response ? err.response.data : err);
      }
    };

    fetchEmployeeDetails();
  }, []); // Empty dependency array means this runs once when the component mounts

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
    profile: employeeProfile,
  } = employeeDetails;

  return (
    <div className="flex flex-col justify-start items-start p-6 w-full space-y-6">
      <div className="flex flex-col md:flex-row w-full max-w-4xl space-x-6">
        {/* Profile Picture - Square */}
        <div className="w-40 h-40 bg-gray-300 overflow-hidden border-5 mb-4" style={{
          backgroundImage: `url(${employeeProfile || profile})`, // Use employee profile pic or default
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />

        {/* Employee Details */}
        <div className="flex flex-col w-full text-gray-600">
          {/* ID, Name, Dept, Role */}
          <div className="flex flex-col space-y-2">
            <p><span>12345678IT{id}</span></p>
            <p><span>{name}</span></p>
            <p><span>{department}</span></p>
            <p><span>{role}</span></p>
          </div>
        </div>
      </div>

      {/* Remaining Details */}
      <div className="bg-white dark:bg-gray-800  dark:border-gray-700  p-4 w-full">
        <div className="flex flex-col space-y-2">
          <p><span>Degree: {degree}</span></p>
          <p><span>Experience: {experience} years</span></p>
          <p><span>Mobile no: {mobile_no}</span></p>
          <p><span>High Skills: {skills.join(", ")}</span></p>
          <h3>CONTINUING</h3>
        </div>
      </div>

    </div>
  );
};

export default Profile;
