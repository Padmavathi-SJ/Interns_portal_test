import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import adminImg from "../../assets/adminLogin.jpg"; // Importing the admin-specific image
import BITLogo from "../../assets/bit-logo.png"; // Import company logo

// Global import of Google Font (Roboto)
import "@fontsource/roboto"; // Importing the font from Google Fonts

const AdminLogin = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
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
                "http://localhost:3000/auth/adminLogin",
                credentials,
                { withCredentials: true } // Set credentials for this request
            );

            if (response.data.loginStatus) {
                // Navigate to admin dashboard
                navigate("/admin-dashboard");
            } else {
                setError(response.data.error || "An unknown error occurred");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Failed to connect to the server. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            {/* Combined Image and Form Container */}
            <div className="h-[80vh] flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left Section - Image */}
                <div className="w-1/2">
                    <img
                        src={adminImg}
                        alt="Admin Login Illustration"
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
                        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                            Bannari Amman Institute Of Technology
                        </h1>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-sm font-roboto"
                                    required
                                />
                                <input
                                    type="password"
                                    name="password"
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-sm font-roboto"
                                    required
                                />
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition text-sm font-roboto"
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

export default AdminLogin;
