import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeamWorkAllocation = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Low");
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_teams");
        setTeams(response.data.Result || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTeam || !title || !deadline) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/auth/allocate_team_work", {
        team_id: selectedTeam,
        title,
        description,
        deadline,
        priority,
        status,
      });

      if (response.data.Status) {
        setMessage("Work allocated successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard/work_allocation"); // Navigate to the work_allocation component
        }, 2000); // Optional delay to show success message
      } else {
        setMessage("Failed to allocate work.");
      }
    } catch (err) {
      console.error("Error allocating work:", err);
      setMessage("Error allocating work.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Team Work Allocation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Select Team:</label>
          <select
            className="border p-2 w-full"
            value={selectedTeam || ""}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="" disabled>
              Select a Team
            </option>
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2">Task Title:</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Task Description:</label>
          <textarea
            className="border p-2 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Deadline:</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-2">Priority:</label>
          <select
            className="border p-2 w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label className="block mb-2">Status:</label>
          <select
            className="border p-2 w-full"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Allocate Work
        </button>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default TeamWorkAllocation;
