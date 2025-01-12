import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/admins');
        if (response.data.Status) {
          setAdmins(response.data.Admins);
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

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Admins</h1>
      <button 
        onClick={handleAddAdmin} 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 mb-4"
      >
        Add Admin
      </button>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{admin.id}</td>
              <td className="py-2 px-4 border-b">{admin.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admins;
