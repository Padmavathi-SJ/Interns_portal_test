import React from 'react';
import { useNavigate } from 'react-router-dom';

const ManageAnnouncements = () => {
  const navigate = useNavigate();

  const handleAnnounceClick = () => {
    navigate('/admin-dashboard/push_announcements');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Manage Announcements</h1>
      <button 
        onClick={handleAnnounceClick} 
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
      >
        Announce Here
      </button>
    </div>
  );
};

export default ManageAnnouncements;
