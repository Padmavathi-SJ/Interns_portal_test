import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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

       // console.log("Token:", token);

        // Check if token is expired
        if (isTokenExpired(token)) {
          setError("Token expired, please log in again.");
          return;
        }

       // console.log("Token is valid");

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

  const { id, name, department, role, experience, salary } = employeeDetails;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Employee Profile</h2>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">ID:</span>
            <span className="text-gray-600">{id}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-600">{name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Department:</span>
            <span className="text-gray-600">{department}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Role:</span>
            <span className="text-gray-600">{role}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Experience:</span>
            <span className="text-gray-600">{experience} years</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-700">Salary:</span>
            <span className="text-gray-600">${salary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
