import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { XIcon } from "@heroicons/react/solid";  // Importing the close icon for the modal

const MyTeam = () => {
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const [showTasks, setShowTasks] = useState(false); // State to control task view modal
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_my_team", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });

        if (response.data.Status) {
          setTeams(response.data.Result);
        } else {
          setMessage(response.data.Message);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        setMessage("Error fetching teams. Please try again.");
      }
    };

    fetchMyTeams();
  }, []);

  const handleViewTasks = (teamId) => {
    setSelectedTeamId(teamId);
    setShowTasks(true);
  };

  const handleCloseTasks = () => {
    setShowTasks(false);
    setSelectedTeamId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 dark:bg-gradient-to-r dark:from-blue-900 dark:via-gray-800 dark:to-blue-900 py-8 px-6">
      {message && <p className="text-red-500 text-center">{message}</p>}
      
      <div className="max-w-4xl mx-auto">
        {teams.length > 0 ? (
          <ul className="space-y-4">
            {teams.map((team) => (
              <li
                key={team.team_id}
                className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
              >
                <span className="font-semibold text-xl text-gray-900 dark:text-gray-200">
                  {team.team_name}
                </span>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out"
                  onClick={() => handleViewTasks(team.team_id)}
                >
                  View Tasks
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !message && <p className="text-center text-gray-500">You are not part of any teams yet.</p>
        )}
      </div>

      {/* Task View Modal */}
      {showTasks && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-20">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md transform transition-all scale-95 hover:scale-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-200">
                Team Tasks
              </h3>
              <button onClick={handleCloseTasks} className="text-gray-400 hover:text-gray-600">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            {/* Add your content for tasks here */}
            <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
              View tasks for team with ID: {selectedTeamId}
            </p>
            <div className="text-center">
              <button
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                onClick={() => navigate(`/employee-dashboard/team_tasks/${selectedTeamId}`)}
              >
                Go to Tasks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;
