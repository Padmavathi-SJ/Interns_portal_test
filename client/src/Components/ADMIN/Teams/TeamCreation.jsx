import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeamCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());
  const [teamName, setTeamName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [noEmployeesMessage, setNoEmployeesMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auth/get_departments");
        if (response.data.Status && Array.isArray(response.data.Result)) {
          setDepartments(response.data.Result);
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
    setSelectedDepartment(departmentId);
    setNoEmployeesMessage("");

    try {
      const response = await axios.get(
        `http://localhost:3000/auth/get_employees_by_department/${departmentId}`
      );
      if (response.data.Status && Array.isArray(response.data.Result)) {
        setEmployees(response.data.Result);
        if (response.data.Result.length === 0) {
          setNoEmployeesMessage("No employees found in this department.");
        }
      } else {
        setNoEmployeesMessage("No employees found in this department.");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployees((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(employeeId)) {
        newSelected.delete(employeeId);
      } else {
        newSelected.add(employeeId);
      }
      return newSelected;
    });
  };

  const handleCreateTeam = async () => {
    if (!teamName || selectedEmployees.size === 0 || !selectedDepartment) {
      alert("Please provide a team name, select a department, and select employees.");
      return;
    }

    const selectedEmployeesArray = Array.from(selectedEmployees);

    try {
      const response = await axios.post("http://localhost:3000/auth/create_team", {
        team_name: teamName,
        team_members: selectedEmployeesArray,
        department_id: selectedDepartment,
      });

      if (response.data.Status) {
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Department:</label>
        <select
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          value={selectedDepartment || ""}
          onChange={(e) => handleDepartmentSelect(e.target.value)}
        >
          <option value="" disabled>Select a Department</option>
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

      {selectedDepartment && (
        <div className="mb-6">
          <h3 className="text-xl text-blue-700 mb-2">Select Employees:</h3>
          {noEmployeesMessage ? (
            <p className="text-red-500">{noEmployeesMessage}</p>
          ) : (
            <ul>
              {employees.map((employee) => (
                <li key={employee.id} className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => handleEmployeeSelect(employee.id)}
                    checked={selectedEmployees.has(employee.id)}
                    className="mr-2"
                  />
                  {employee.name} ({employee.department})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedEmployees.size > 0 && (
        <div className="mb-6">
          <h3 className="text-lg text-blue-700 mb-2">Selected Employees:</h3>
          <ul>
            {Array.from(selectedEmployees).map((employeeId) => {
              const employee = employees.find((emp) => emp.id === employeeId);
              if (!employee) {
                return <li key={employeeId} className="text-red-500">Employee not found</li>;
              }
              return (
                <li key={employeeId}>
                  {employee.name} ({employee.department})
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        onClick={handleCreateTeam}
        className="w-full px-4 py-2 font-semibold text-white bg-blue-700 rounded-md hover:bg-blue-800 transition duration-300 ease-in-out"
      >
        Create Team
      </button>
    </div>
  );
};

export default TeamCreation;
