import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userLoginImage from "../assets/userLogin.jpg"; // Importing the image

const UserLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        employee_id: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:3000/auth/user_login",
                credentials
            );

            if (response.data.Status) {
                const token = response.data.token;
                localStorage.setItem("userToken", token); // Store token locally

                // Navigate to employee dashboard
                navigate("/employee-dashboard");
            } else {
                setError(response.data.Error);
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("An error occurred during login. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            {/* Combined Image and Form Container */}
            <div className="h-[80vh] flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left Section - Image */}
                <div className="w-1/2">
                    <img
                        src={userLoginImage}
                        alt="Login Illustration"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Right Section - Form */}
                <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <h2 className="text-3xl font-semibold text-center mb-6">
                            Employee Login
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="employee_id"
                                    value={credentials.employee_id}
                                    onChange={handleChange}
                                    placeholder="Employee ID"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                                    required
                                />
                                {error && <p className="text-red-500">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
