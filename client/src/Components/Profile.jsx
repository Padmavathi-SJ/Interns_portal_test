import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
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
          setEmployeeDetails(response.data.Data);
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-gray-600 font-semibold">Loading employee details...</div>
      </div>
    );
  }

  const { id, name, department, role, profile: employeeProfile } = employeeDetails;

  return (
    <div className="flex justify-center items-center h-[30vh] p-3">
      <div className="flex items-center w-full max-w-4xl">
        {/* Profile Picture - Square */}
        <div className="w-40 h-40 bg-gray-300 overflow-hidden border-5" style={{
          backgroundImage: `url(${employeeProfile || profile})`, // Use employee profile pic or default
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />

        {/* Employee Details */}
        <div className="ml-6 space-y-4 text-gray-600">
          <p className="flex justify-between"><span>12345678IT{id}</span></p>
          <p className="flex justify-between"><span>{name}</span></p>
          <p className="flex justify-between"><span>{department}</span></p>
          <p className="flex justify-between"><span>{role}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
