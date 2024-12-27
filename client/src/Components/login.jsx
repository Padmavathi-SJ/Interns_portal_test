import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(
        'http://localhost:3000/auth/adminLogin',
        values,
        { withCredentials: true } // Set credentials for this request
      )
      .then((result) => {
        if (result.data.loginStatus) {
          navigate('/admin-dashboard');
        } else {
          setError(result.data.error || 'An unknown error occurred');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to connect to the server');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        {error && (
          <div
            className="mb-4 text-red-600 text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}
        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
              placeholder="Enter your password"
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring focus:ring-indigo-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
