import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditTeam = () => {
  const [teamDetails, setTeamDetails] = useState({
    team_name: "",
    team_members: new Set(),
    department_id: null,
  });
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { team_id } = useParams();
  const navigate = useNavigate();

  const fetchData = async (url, onSuccess, onFailure) => {
    try {
      const response = await axios.get(url);
      if (response.data.Status) {
        onSuccess(response.data.Result);
      } else {
        onFailure(response.data.Message || "Data not found.");
      }
    } catch (error) {
      console.error(`Error fetching ${url}:`, error);
      onFailure(error.message || "Error loading data.");
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        await fetchData(
          `http://localhost:3000/auth/get_team/${team_id}`,
          async (result) => {
            const { team_name, team_members, department_id } = result;

            if (!department_id) {
              setError("Department ID is missing for this team.");
              return;
            }

            setTeamDetails({
              team_name,
              team_members: new Set(JSON.parse(team_members)),
              department_id,
            });

            await fetchData(
              `http://localhost:3000/auth/get_employees_by_department/${department_id}`,
              (employees) => setEmployees(employees),
              (message) => setError(`Error fetching employees: ${message}`)
            );
          },
          (message) => setError(`Error fetching team: ${message}`)
        );
      } catch (error) {
        setError("Initialization failed. Please try again later.");
      }
      setLoading(false);
    };

    fetchInitialData();
  }, [team_id]);

  const handleEmployeeSelect = (employeeId) => {
    setTeamDetails((prev) => {
      const newTeamMembers = new Set(prev.team_members);
      if (newTeamMembers.has(employeeId)) {
        newTeamMembers.delete(employeeId);
      } else {
        newTeamMembers.add(employeeId);
      }
      return { ...prev, team_members: newTeamMembers };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamDetails.team_name || !teamDetails.team_members.size) {
      alert("Please fill out all fields and select at least one team member.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/auth/edit_team/${team_id}`,
        {
          team_name: teamDetails.team_name,
          team_members: Array.from(teamDetails.team_members),
          department_id: teamDetails.department_id,
        }
      );

      if (response.data.Status) {
        alert("Team updated successfully!");
        navigate("/admin-dashboard/teams");
      } else {
        alert("Failed to update team.");
      }
    } catch (error) {
      alert("Error updating team.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Edit Team</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="team_name" className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <input
            type="text"
            id="team_name"
            value={teamDetails.team_name}
            onChange={(e) => setTeamDetails({ ...teamDetails, team_name: e.target.value })}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input
            type="text"
            value={teamDetails.department_id || ""}
            readOnly
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <h3 className="text-xl mb-2 text-blue-700">Select Employees:</h3>
          {employees.length > 0 ? (
            <ul>
              {employees.map((employee) => (
                <li key={employee.id} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={teamDetails.team_members.has(employee.id)}
                    onChange={() => handleEmployeeSelect(employee.id)}
                    className="mr-2"
                  />
                  {employee.name} ({employee.department})
                </li>
              ))}
            </ul>
          ) : (
            <p>No employees available in this department.</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-indigo-600"
            disabled={!teamDetails.team_name || teamDetails.team_members.size === 0}
          >
            Update Team
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeam;
