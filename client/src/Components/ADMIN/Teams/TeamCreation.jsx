import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeamCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [currentEmployees, setCurrentEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Map()); // id -> employee object
  const [teamName, setTeamName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/get-departments");
        if (response.data.status && Array.isArray(response.data.Departments)) {
          setDepartments(response.data.Departments);
        } else {
          console.error("Error fetching departments:", response.data);
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentSelect = async (departmentId) => {
    if (!departmentId) return;
    try {
      const response = await axios.get(`http://localhost:3000/admin/get-employees/${departmentId}`);
      if (response.data.status && Array.isArray(response.data.Employees)) {
        setCurrentEmployees(response.data.Employees); // Replace with new employees
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployees((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(employee.id)) {
        newMap.delete(employee.id);
      } else {
        newMap.set(employee.id, employee);
      }
      return newMap;
    });
  };

  const handleCreateTeam = async () => {
    if (!teamName || selectedEmployees.size === 0) {
      alert("Please provide a team name and select at least one employee.");
      return;
    }

    const selectedEmployeesArray = Array.from(selectedEmployees.values()).map(emp => emp.id);

    try {
      const response = await axios.post("http://localhost:3000/admin/create-team", {
        team_name: teamName,
        team_members: selectedEmployeesArray,
      });

      if (response.data.status) {
        alert("Team created successfully!");
        navigate("/admin-dashboard/teams");
      } else {
        alert("Failed to create team.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Create a New Team</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Department to Load Employees:</label>
        <select
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          onChange={(e) => handleDepartmentSelect(e.target.value)}
        >
          <option value="">Select a Department</option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Team Name:</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      {currentEmployees.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl text-blue-700 mb-2">Select Employees (Only From Selected Dept):</h3>
          <ul className="max-h-60 overflow-y-auto border p-2 rounded-md">
            {currentEmployees.map((employee) => (
              <li key={employee.id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  onChange={() => handleEmployeeSelect(employee)}
                  checked={selectedEmployees.has(employee.id)}
                  className="mr-2"
                />
                {employee.name} ({employee.department})
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedEmployees.size > 0 && (
        <div className="mb-6">
          <h3 className="text-lg text-blue-700 mb-2">Selected Employees:</h3>
          <ul>
            {Array.from(selectedEmployees.values()).map((emp) => (
              <li key={emp.id}>
                {emp.name} ({emp.department})
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleCreateTeam}
        className="w-full px-4 py-2 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800 transition duration-300"
      >
        Create Team
      </button>
    </div>
  );
};

export default TeamCreation;
