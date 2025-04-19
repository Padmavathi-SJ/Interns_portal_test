import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import landingImg from "../../assets/employee.jpg"; // Importing the image
import BITLogo from "../../assets/bit-logo.png"; // Import company logo

// Global import of Google Font (Roboto)
import "@fontsource/roboto"; // Importing the font from Google Fonts

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
                "http://localhost:3000/user/login",
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
                        src={landingImg}
                        alt="Login Illustration"
                        className="object-cover w-full h-full"
                    />
                </div>

                {/* Right Section - Form */}
                <div className="w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {/* Company Logo */}
                        <div className="flex justify-center mb-6">
                            <img
                                src={BITLogo}
                                alt="Company Logo"
                                className="h-16 w-auto"
                            />
                        </div>

                        {/* Heading */}
                        <h1 className="text-3xl font-bold text-center mb-6 text-blue-900">
                            Bannari Amman Institute Of Technology
                        </h1>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    name="employee_id"
                                    value={credentials.employee_id}
                                    onChange={handleChange}
                                    placeholder="Employee ID"
                                    className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-sm font-roboto"
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-sm font-roboto"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-sm font-roboto"
                                    required
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition text-sm font-roboto"
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