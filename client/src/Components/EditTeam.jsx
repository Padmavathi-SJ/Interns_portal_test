import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditTeam = () => {
  const [teamDetails, setTeamDetails] = useState({
    team_name: "",
    team_members: "",
    created_at: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { team_id } = useParams(); // Get team_id from the URL params
  const navigate = useNavigate();

  useEffect(() => {
    if (!team_id) {
      setError("Invalid team ID");
      return;
    }

    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/get_team/${team_id}`);
        if (response.data.Result) {
          const { team_name, team_members, created_at } = response.data.Result;
          
          // Ensure team_members is an array and join them if it's an array
          const members = Array.isArray(team_members) ? team_members.join(", ") : team_members;

          setTeamDetails({
            team_name,
            team_members: members, // Store team members as a comma-separated string
            created_at,
          });
          setLoading(false);
        } else {
          setError("Team not found");
        }
      } catch (error) {
        console.error("Error fetching team details:", error);
        setError("Error fetching team details.");
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [team_id]); // Fetch the team when `team_id` changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert the comma-separated string back to an array
      const membersArray = teamDetails.team_members
        .split(",")
        .map((member) => member.trim());

      const response = await axios.put(
        `http://localhost:3000/auth/edit_team/${team_id}`,
        {
          team_name: teamDetails.team_name,
          team_members: membersArray, // Send the team_members as an array
        }
      );
      if (response.data.Status) {
        alert("Team updated successfully!");
        navigate("/admin-dashboard/teams"); // Navigate back to team management page
      } else {
        alert("Failed to update team.");
      }
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Error updating team.");
    }
  };

  if (loading) {
    return <div>Loading team details...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Edit Team</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="team_name" className="block text-gray-700">Team Name</label>
          <input
            type="text"
            id="team_name"
            name="team_name"
            value={teamDetails.team_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="team_members" className="block text-gray-700">Team Members (comma separated)</label>
          <input
            type="text"
            id="team_members"
            name="team_members"
            value={teamDetails.team_members}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="created_at" className="block text-gray-700">Created At</label>
          <input
            type="text"
            id="created_at"
            name="created_at"
            value={teamDetails.created_at}
            className="w-full p-2 border border-gray-300 rounded"
            disabled
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Update Team
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeam;
