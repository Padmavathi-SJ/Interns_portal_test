import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/get_announcements");
        if (response.data.status) {
          setAnnouncements(response.data.Result);
          setFilteredAnnouncements(response.data.Result);
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
        await axios.delete(`http://localhost:3000/admin/delete_announcement/${id}`);
        setAnnouncements((prev) => prev.filter(announcement => announcement.id !== id));
        setFilteredAnnouncements((prev) => prev.filter(announcement => announcement.id !== id));
      } catch (error) {
        setError("An error occurred while deleting the announcement.");
      }
    }
  };

  const handlePushAnnouncement = () => {
    navigate("/admin-dashboard/push_announcements");
  };

  const handleViewDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = announcements.filter(announcement =>
      announcement.category.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredAnnouncements(filtered);
  };

  const priorityColors = {
    low: 'text-green-600',
    normal: 'text-yellow-600',
    high: 'text-orange-600',
    urgent: 'text-red-600',
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-8xl mx-auto transition-all duration-300">
      <h2 className="text-3xl font-semibold text-blue-700 mb-4">Manage Announcements</h2>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search announcements by category..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 w-full md:w-1/3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          onClick={handlePushAnnouncement}
          className="px-6 py-2 font-semibold text-white bg-blue-800 rounded-md hover:bg-blue-800"
        >
          Announce Here
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {filteredAnnouncements.length > 0 ? (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg mb-6">
          <table className="min-w-full table-auto">
            <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 text-blue-700">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Priority</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAnnouncements.map(announcement => (
                <tr key={announcement.id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2 text-gray-800">{announcement.id}</td>
                  <td className="px-4 py-2 text-gray-800">{announcement.category}</td>
                  <td className={`px-4 py-2 ${priorityColors[announcement.priority]}`}>{announcement.priority}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(announcement)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEdit(announcement.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-600">No announcements found.</div>
      )}

      {isModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{selectedAnnouncement.title}</h2>
            <p className="mb-4">{selectedAnnouncement.description}</p>
            <p className="mb-4">{selectedAnnouncement.extra_info}</p>
            <div className="flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded-md">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
