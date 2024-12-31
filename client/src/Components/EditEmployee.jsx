import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditEmployee = () => {
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    experience: "",
    department_id: "",
    salary: "",
    degree: "",
    university: "",
    graduation_year: "",
    skills: "",
    certifications: "",
    mobile_no: "",
    address: "",
  });

  const [departments, setDepartments] = useState([]);
  const { employeeId } = useParams(); // Get employeeId from URL params
  const navigate = useNavigate();

  // Fetch departments on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/get_departments")
      .then((response) => {
        if (response.data.Status) {
          setDepartments(response.data.Result); // Populate departments
        } else {
          alert("Failed to fetch departments");
        }
      })
      .catch((err) => {
        console.error("Error fetching departments:", err);
        alert("Error fetching departments");
      });
  }, []);

  // Fetch employee details based on employeeId
  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/get_employee_by_id/${employeeId}`)
      .then((response) => {
        if (response.data.Status) {
          setEmployee(response.data.Result[0]); // Set employee data
        } else {
          alert("Failed to fetch employee data");
        }
      })
      .catch((err) => {
        console.error("Error fetching employee data:", err);
        alert("Error fetching employee data");
      });
  }, [employeeId]);

  // Handle form submission for updating employee
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const { name, email, password, role, department_id, salary } = employee;
    if (!name || !email || !password || !role || !department_id || !salary) {
      alert("Please fill in all required fields.");
      return;
    }

    axios
      .put(`http://localhost:3000/auth/edit_employee/${employeeId}`, employee)
      .then((response) => {
        if (response.data.Status) {
          alert("Employee updated successfully");
          navigate("/admin-dashboard/employee");
        } else {
          alert("Failed to update employee");
        }
      })
      .catch((error) => {
        console.error(
          "Error updating employee:",
          error.response || error.message
        );
        alert("Failed to update employee. Check console for details.");
      });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Edit Employee
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Employee fields */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            value={employee.email}
            onChange={(e) =>
              setEmployee({ ...employee, email: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            value={employee.password}
            onChange={(e) =>
              setEmployee({ ...employee, password: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Role
          </label>
          <input
            type="text"
            name="role"
            value={employee.role}
            onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700"
          >
            Department
          </label>
          <select
            name="department"
            value={employee.department_id}
            onChange={(e) =>
              setEmployee({
                ...employee,
                department_id: parseInt(e.target.value, 10),
              })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary
          </label>
          <input
            type="number"
            name="salary"
            value={employee.salary}
            onChange={(e) =>
              setEmployee({ ...employee, salary: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700"
          >
            Experience
          </label>
          <textarea
            name="experience"
            value={employee.experience || ""}
            onChange={(e) =>
              setEmployee({ ...employee, experience: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
          />
        </div>

        {/* Additional fields */}
        <div className="mb-4">
          <label
            htmlFor="degree"
            className="block text-sm font-medium text-gray-700"
          >
            Degree
          </label>
          <textarea
            name="degree"
            value={employee.degree || ""} // fallback to empty string if degree is null or undefined
            onChange={(e) =>
              setEmployee({ ...employee, degree: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="university"
            className="block text-sm font-medium text-gray-700"
          >
            University
          </label>
          <textarea
            name="university"
            value={employee.university || ""} // fallback to empty string if university is null or undefined
            onChange={(e) =>
              setEmployee({ ...employee, university: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="graduation_year"
            className="block text-sm font-medium text-gray-700"
          >
            Graduation Year
          </label>
          <input
            type="number"
            name="graduation_year"
            value={employee.graduation_year}
            onChange={(e) =>
              setEmployee({ ...employee, graduation_year: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="skills"
            className="block text-sm font-medium text-gray-700"
          >
            Skills
          </label>
          <textarea
            name="skills"
            value={employee.skills || ""}
            onChange={(e) =>
              setEmployee({ ...employee, skills: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="certifications"
            className="block text-sm font-medium text-gray-700"
          >
            Certifications
          </label>
          <textarea
            name="certifications"
            value={employee.certifications || ""}
            onChange={(e) =>
              setEmployee({ ...employee, certifications: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="mobile_no"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile No
          </label>
          <input
            type="text"
            name="mobile_no"
            value={employee.mobile_no}
            onChange={(e) =>
              setEmployee({ ...employee, mobile_no: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <textarea
            name="address"
            value={employee.address || ""} // fallback to empty string if address is null or undefined
            onChange={(e) =>
              setEmployee({ ...employee, address: e.target.value })
            }
            className="w-full px-4 py-2 mt-1 border rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
