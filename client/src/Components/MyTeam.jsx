import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyTeam = () => {
  const [teams, setTeams] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyTeams = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_my_team", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, // Authentication token
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
    navigate(`/employee-dashboard/team_tasks/${teamId}`);
  };

  return (
    <div>
      {message && <p className="text-red-500 text-center">{message}</p>}
      {teams.length > 0 ? (
        <ul className="space-y-4">
          {teams.map((team) => (
            <li
              key={team.team_id}
              className="flex justify-between items-center border p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <span className="font-medium">{team.team_name}</span>
              <button
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
                onClick={() => handleViewTasks(team.team_id)}
              >
                View Task
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !message && <p className="text-center text-gray-500">You are not part of any teams yet.</p>
      )}
    </div>
  );
};

export default MyTeam;
