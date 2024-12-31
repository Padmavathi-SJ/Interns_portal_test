import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeamCreation = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(new Set()); // Store selected employees in a Set
  const [teamName, setTeamName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [noEmployeesMessage, setNoEmployeesMessage] = useState(""); // For "No employees found"
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
    setNoEmployeesMessage(""); // Reset message when changing department

    // Fetch employees for the selected department
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

    // Convert selected employees Set to an array before sending it to the backend
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
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Create a New Team</h2>

      {/* Select Department */}
      <div>
        <label className="block mb-2">Select Department:</label>
        <select
          className="border p-2 w-full"
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

      {/* Team Name Input */}
      <div className="mt-4">
        <label className="block mb-2">Team Name:</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
      </div>

      {/* Employee Selection */}
      {selectedDepartment && (
        <div className="mt-4">
          <h3 className="text-xl mb-2">Select Employees:</h3>
          {noEmployeesMessage ? (
            <p className="text-red-500">{noEmployeesMessage}</p>
          ) : (
            <ul>
              {employees.map((employee) => (
                <li key={employee.id} className="flex items-center">
                  <input
                    type="checkbox"
                    onChange={() => handleEmployeeSelect(employee.id)}
                    checked={selectedEmployees.has(employee.id)} // Use Set's has method to check selection
                    className="mr-2"
                  />
                  {employee.name} ({employee.department})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Selected Employees */}
      {selectedEmployees.size > 0 && (
  <div className="mt-4">
    <h3 className="text-lg mb-2">Selected Employees:</h3>
    <ul>
      {Array.from(selectedEmployees).map((employeeId) => {
        const employee = employees.find((emp) => emp.id === employeeId);
        // Check if employee is found
        if (!employee) {
          return <li key={employeeId} className="text-red-500">Employee not found</li>;
        }
        return (
          <li key={employeeId} className="flex items-center">
            {employee.name} ({employee.department})
          </li>
        );
      })}
    </ul>
  </div>
)}


      {/* Create Team Button */}
      <button
        onClick={handleCreateTeam}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Team
      </button>
    </div>
  );
};

export default TeamCreation;
