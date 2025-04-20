import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:3000/admin/get-admins');
        console.log("Fetched admins:", response.data); // Log response data
        if (response.data.status) {
          setAdmins(response.data.Admins);
          setFilteredAdmins(response.data.Admins);  // Update filteredAdmins with all admins initially
        } else {
          console.error('Failed to fetch admins');
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
  
    fetchAdmins();
  }, []);
  

  const handleAddAdmin = () => {
    navigate('/admin-dashboard/add_admin'); // Navigate to the AddAdmin component
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = admins.filter((admin) =>
      admin.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAdmins(filtered);
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-blue-700">Admins</h2>
        <input
          type="text"
          placeholder="Search admins..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      <button 
        onClick={handleAddAdmin} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-6"
      >
        Add Admin
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredAdmins.length > 0 ? (
    filteredAdmins.map((admin) => (
      <div key={admin.id} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <div className="text-lg font-semibold text-blue-700 mb-2">Admin ID: {admin.id}</div>
        <div className="text-gray-800 text-sm mb-4">Email: {admin.email}</div>
        
      </div>
    ))
  ) : (
    <p>No admins found</p> // Display a fallback message if no admins are available
  )}
</div>

    </div>
  );
};

export default Admins;
