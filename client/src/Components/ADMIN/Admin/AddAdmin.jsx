import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Hook to navigate to another route

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/add_admin', { email, password });
      if (response.data.Status) {
        setSuccess('Admin added successfully');
        setEmail('');
        setPassword('');
        
        // Redirect to admins page after successfully adding the admin
        setTimeout(() => {
          navigate('/admin-dashboard/admins'); // Redirect to the Admins page
        }, 1000); // Optional: adding a small delay before navigation
      } else {
        setError('Failed to add admin');
      }
    } catch (error) {
      setError('Error adding admin');
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-md mx-auto">
      <h2 className="text-3xl font-semibold text-blue-700 mb-6">Add New Admin</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter admin's email"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter admin's password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800 transition duration-300 ease-in-out"
        >
          Add Admin
        </button>
      </form>
    </div>
  );
};

export default AddAdmin;
