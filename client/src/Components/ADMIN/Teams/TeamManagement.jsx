import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons

const TeamManagement = () => {
  const [teamList, setTeamList] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTeams, setTotalTeams] = useState(0);
  const teamsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_teams");
        if (Array.isArray(response.data.Result)) {
          setTeamList(response.data.Result);
          setTotalTeams(response.data.Result.length);
          setFilteredTeams(response.data.Result);
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
    navigate("/admin-dashboard/team_creation"); // Navigate to the team creation page
  };

  const handleEditTeam = (team) => {
    navigate(`/admin-dashboard/teams/edit_team/${team.team_id}`); // Navigate to the edit page with the selected team's id
  };

  const handleDeleteTeam = async (teamId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this team?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/auth/delete_team/${teamId}`);
        if (response.data.Status) {
          setTeamList(teamList.filter(team => team.team_id !== teamId));
          setFilteredTeams(filteredTeams.filter(team => team.team_id !== teamId));
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = teamList.filter(team =>
      team.team_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredTeams(filtered);
    setCurrentPage(1); // Reset to first page on search change
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentTeams = filteredTeams.slice(
    (currentPage - 1) * teamsPerPage,
    currentPage * teamsPerPage
  );

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-8xl mx-auto transition-all duration-300">
      <h2 className="text-3xl font-semibold text-blue-700 mb-4">Team Management</h2>

      {/* Search Box */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search teams by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-3 w-full md:w-1/3 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
        <button
          onClick={handleCreateTeam}
          className="inline-block px-6 py-2 ml-4 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800"
        >
          Create New Team
        </button>
      </div>

      {/* Teams Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg mb-6">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-100 via-white to-blue-50 text-blue-700">
            <tr>
              <th className="px-4 py-2 text-left">Team ID</th>
              <th className="px-4 py-2 text-left">Team Name</th>
              <th className="px-4 py-2 text-left">Department</th>
              <th className="px-4 py-2 text-left">Team Members</th>
              <th className="px-4 py-2 text-left">Created At</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentTeams.length > 0 ? (
              currentTeams.map((team) => (
                <tr key={team.team_id} className="border-b hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2 text-gray-800">{team.team_id}</td>
                  <td className="px-4 py-2 text-gray-800">{team.team_name}</td>
                  <td className="px-4 py-2 text-gray-800">{team.department_name || "N/A"}</td>
                  <td className="px-4 py-2 text-gray-800">
                    {team.team_members && Array.isArray(team.team_members)
                      ? team.team_members.join(", ")
                      : "No members"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">{team.created_at}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEditTeam(team)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTeam(team.team_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-2 text-center text-gray-600">
                  No teams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md mr-2 disabled:bg-gray-400"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-700 text-white rounded-md ml-2 disabled:bg-gray-400"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
