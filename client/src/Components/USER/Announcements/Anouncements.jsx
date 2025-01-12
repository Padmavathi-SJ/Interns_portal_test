import React, { useState, useEffect } from "react";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_announcements", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });

        if (response.data.Status) {
          setAnnouncements(response.data.Result);
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

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "normal":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 px-4 py-4">
      {message && <p className="text-red-500 text-center">{message}</p>}
      {announcements.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                {announcement.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {new Date(announcement.created_at).toLocaleString()}
              </p>
              <p className="text-gray-700 dark:text-gray-300">{announcement.description}</p>
              {announcement.extra_info && (
                <p className="mt-2 text-gray-600 dark:text-gray-400">{announcement.extra_info}</p>
              )}
              <div className={`mt-3 px-2 py-1 text-sm rounded ${getPriorityClass(announcement.priority)}`}>
                Priority: {announcement.priority}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !message && <p className="text-center text-gray-500">No announcements available.</p>
      )}
    </div>
  );
};

export default Announcements;
