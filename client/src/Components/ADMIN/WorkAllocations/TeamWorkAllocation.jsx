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
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Team Work Allocation</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select Team</label>
          <select
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Task Description</label>
          <textarea
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
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
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-indigo-600"
        >
          Allocate Work
        </button>
      </form>
    </div>
  );
};

export default TeamWorkAllocation;
