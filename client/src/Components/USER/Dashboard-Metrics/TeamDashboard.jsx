import React, { useState, useEffect } from "react";
import axios from "axios";

const TeamDashboard = () => {
  const [teamCount, setTeamCount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchTeamCount = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_team_count", {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });

        if (response.data.Status) {
          setTeamCount(response.data.Result.teamCount);
        } else {
          setMessage(response.data.Message || "No contribution data found.");
        }
      } catch (err) {
        console.error("Error fetching team count:", err);
        setMessage("Error fetching contribution data. Please try again.");
      }
    };

    fetchTeamCount();
  }, []);

  if (message) {
    return (
      <div className="text-red-500 bg-red-100 p-4 rounded shadow">
        {message}
      </div>
    );
  }

  if (teamCount === 0) {
    return (
      <div className="text-gray-500 text-center p-6">
        Loading contribution overview...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">My Teams</h2>
      <div className="flex justify-center flex-col items-center">
        <p className="text-lg mb-2">I am Contributing to {teamCount} Teams</p>
        <p className="text-lg mb-2">I am Contributing to {teamCount} Teams</p>


<div className="w-full bg-gray-200 rounded-full">
  <div
    className="bg-green-500 text-center text-white rounded-full"
    style={{ width: `${(teamCount / 10) * 100}%`, height: "55px" }} // Increase height here
  >
    <span className="text-sm font-medium">{teamCount} / 10 Teams</span> 
  </div>
</div>

      </div>
    </div>
  );
};

export default TeamDashboard;
