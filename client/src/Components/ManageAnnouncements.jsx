import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_announcements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        if (response.data.Status) {
          setAnnouncements(response.data.Result);
        } else {
          setError("Failed to fetch announcements.");
        }
      } catch (error) {
        setError("An error occurred while fetching announcements.");
      }
    };

    fetchAnnouncements();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin-dashboard/edit_announcement/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`http://localhost:3000/auth/delete_announcement/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        setAnnouncements((prev) => prev.filter(announcement => announcement.id !== id));
      } catch (error) {
        setError("An error occurred while deleting the announcement.");
      }
    }
  };

  const handlePushAnnouncement = () => {
    navigate("/admin-dashboard/push_announcements");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-3xl font-bold mb-6">Manage Announcements</h1>

      <div className="mb-6">
        <button
          onClick={handlePushAnnouncement}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Announce Here
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {announcements.length > 0 ? (
        <table className="min-w-full table-auto border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Priority</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(announcement => (
              <tr key={announcement.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{announcement.title}</td>
                <td className="px-4 py-2">{announcement.category}</td>
                <td className="px-4 py-2">{announcement.priority}</td>
                <td className="px-4 py-2">{announcement.description}</td>
                <td className="px-4 py-2">
                  <button 
                    onClick={() => handleEdit(announcement.id)} 
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(announcement.id)} 
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center text-gray-600">No announcements found.</div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
