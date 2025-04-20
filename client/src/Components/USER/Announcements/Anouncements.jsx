import React, { useState, useEffect } from "react";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  // State to track the modal open state and the selected announcement
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/get_announcements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });

        if (response.data.status) {
          setAnnouncements(response.data.Announcements);
        } else {
          setMessage(response.data.Message);
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setMessage("Error fetching announcements. Please try again.");
      }
    };

    fetchAnnouncements();
  }, []);

  const handleOpenModal = (announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const handleCloseModal = () => {
    setSelectedAnnouncement(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-200 dark:bg-gradient-to-r dark:from-blue-900 dark:via-gray-800 dark:to-blue-900 py-8 px-6">
      {message && <p className="text-red-500 text-center">{message}</p>}

      <div className="max-w-6xl mx-auto space-y-8">
        <h2 className="text-3xl font-semibold text-center text-gray-900 dark:text-gray-100">Announcements</h2>

        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl p-6 space-y-4 cursor-pointer"
                onClick={() => handleOpenModal(announcement)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-200">
                    {announcement.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full 
                      ${announcement.priority === "urgent" ? "bg-red-500 text-white" :
                      announcement.priority === "high" ? "bg-yellow-500 text-white" :
                      announcement.priority === "normal" ? "bg-blue-500 text-white" :
                      "bg-green-500 text-white"}`}
                  >
                    {announcement.priority}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <p>{new Date(announcement.created_at).toLocaleString()}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium 
                      ${announcement.category === "individual" ? "bg-teal-500 text-white" :
                      announcement.category === "all" ? "bg-indigo-500 text-white" :
                      "bg-yellow-500 text-white"}`}
                  >
                    {announcement.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !message && <p className="text-center text-gray-500">No announcements available.</p>
        )}
      </div>

      {/* Modal for full announcement details */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-11/12 md:w-3/4 lg:w-1/2 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
                {selectedAnnouncement.title}
              </h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={handleCloseModal}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 9.293l4.646-4.647a1 1 0 1 1 1.414 1.414L11.414 10l4.646 4.646a1 1 0 1 1-1.414 1.414L10 11.414l-4.646 4.646a1 1 0 1 1-1.414-1.414L8.586 10 3.94 5.354a1 1 0 1 1 1.414-1.414L10 9.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">{selectedAnnouncement.description}</p>
              {selectedAnnouncement.extra_info && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">Extra Info</h4>
                  <p className="text-gray-700 dark:text-gray-300">{selectedAnnouncement.extra_info}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6 text-sm text-gray-500 dark:text-gray-400">
              <p>Created on: {new Date(selectedAnnouncement.created_at).toLocaleString()}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium 
                  ${selectedAnnouncement.category === "individual" ? "bg-teal-500 text-white" :
                  selectedAnnouncement.category === "all" ? "bg-indigo-500 text-white" :
                  "bg-yellow-500 text-white"}`}
              >
                {selectedAnnouncement.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
