import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeamManagement = () => {
  const [teamList, setTeamList] = useState([]);
  const [error, setError] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_teams");
        if (Array.isArray(response.data.Result)) {
          setTeamList(response.data.Result);
        } else {
          console.error("Expected an array but received:", response.data);
          setError("No teams found.");
        }
      } catch (error) {
        console.error("Error fetching teams:", error);
        setError("Error fetching teams.");
      }
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = () => {
    navigate("/admin-dashboard/team_creation"); // Navigate to the department page to create a team
  };

  const handleEditTeam = (team) => {
    // Navigate to the edit page with the selected team's id
    navigate(`/admin-dashboard/teams/edit_team/${team.team_id}`);
  };

  const handleDeleteTeam = async (teamId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this team?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/auth/delete_team/${teamId}`);
        if (response.data.Status) {
          setTeamList(teamList.filter(team => team.team_id !== teamId));
          alert("Team deleted successfully!");
        } else {
          alert("Failed to delete team.");
        }
      } catch (error) {
        console.error("Error deleting team:", error);
        alert("Error deleting team.");
      }
    }
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Team Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleCreateTeam}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create New Team
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="px-4 py-2 text-left">Team Name</th>
              <th className="px-4 py-2 text-left">Team Members</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(teamList) && teamList.length > 0 ? (
              teamList.map((team) => (
                <tr key={team.team_id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{team.team_name}</td>
                  <td className="px-4 py-2">
                    {team.team_members && Array.isArray(team.team_members)
                      ? team.team_members.join(", ")
                      : "No members"}
                  </td>
                  <td className="px-4 py-2">{team.created_at}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.team_id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 text-center">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedTeam && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Team Details</h3>
            <p><strong>Team Name:</strong> {selectedTeam.team_name}</p>
            <p><strong>Team Members:</strong> {selectedTeam.team_members.join(", ")}</p>
            <p><strong>Created At:</strong> {selectedTeam.created_at}</p>
            <button
              onClick={() => setSelectedTeam(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
