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
        // Fetch team details
        await fetchData(
          `http://localhost:3000/auth/get_team/${team_id}`,
          async (result) => {
            console.log("Fetched Team Details:", result);
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
  
            // Fetch employees within the department
            await fetchData(
              `http://localhost:3000/auth/get_employees_by_department/${department_id}`,
              (employees) => {
                console.log("Fetched Employees:", employees);
                setEmployees(employees);
              },
              (message) => setError(`Error fetching employees: ${message}`)
            );
          },
          (message) => setError(`Error fetching team: ${message}`)
        );
      } catch (error) {
        console.error("Initialization Error:", error);
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
      console.error("Error updating team:", error);
      alert("Error updating team.");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Edit Team</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team Name */}
        <div>
          <label htmlFor="team_name" className="block text-gray-700">
            Team Name
          </label>
          <input
            type="text"
            id="team_name"
            value={teamDetails.team_name}
            onChange={(e) => setTeamDetails({ ...teamDetails, team_name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-gray-700">Department</label>
          <input
            type="text"
            value={teamDetails.department_id || ""}
            readOnly
            className="border p-2 w-full bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Employee Selection */}
        <div>
          <h3 className="text-xl mb-2">Select Employees:</h3>
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

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
