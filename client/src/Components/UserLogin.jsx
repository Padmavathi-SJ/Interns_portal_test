import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Employee Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="employee_id"
                            value={credentials.employee_id}
                            onChange={handleChange}
                            placeholder="Employee ID"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={credentials.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
