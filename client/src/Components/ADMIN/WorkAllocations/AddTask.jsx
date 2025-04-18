import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee_id: "",
    department_name: "",
    title: "",
    description: "",
    date: "",
    from_time: "",
    to_time: "",
    venue: "",
    deadline: "",
    priority: "Low",
    created_at: new Date().toISOString(),
    status: "Pending"
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/admin/get-departments")
      .then((response) => {
        if (response.data.status) {
          setDepartments(response.data.Departments);
        } else {
          setMessage("Failed to fetch departments");
        }
      }).catch((error) => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  const handleDeptChange = (e) => {
    const departmentId = e.target.value;
    const selectedDept = departments.find((dept) => dept.id.toString() === departmentId);

    setFormData((prev) => ({ 
      ...prev, 
      department_id: departmentId, 
      department_name: selectedDept?.name || "",
      employee_id: "" }));

    if (departmentId) {
      axios.get(`http://localhost:3000/admin/get-employees/${departmentId}`)
        .then((response) => {
          if (response.data.status) {
            setEmployees(response.data.Employees);
          } else {
            setEmployees([]);
          }
        }).catch((error) => {
          console.error("Error fetching employees:", error);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["employee_id", "department_name", "title", "deadline", "date", "from_time", "to_time", "venue"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setMessage("Please fill all required fields.");
        return;
      }
    }

    axios.post("http://localhost:3000/admin/allocate_work", formData)
      .then((res) => {
        if (res.data.status) {
          window.alert("Work allocated successfully!");
          setMessage("");
          navigate('/admin-dashboard/work_allocation');
        } else {
          setMessage(res.data.Error || "Failed to allocate work");
        }
      }).catch((err) => {
        console.error("Error allocating work:", err);
        setMessage("Error allocating work");
      });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Allocate Work</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>Department</label>
          <select
            name="department_id"
            value={formData.department_id}
            onChange={handleDeptChange}
            className="w-full px-4 py-2 mt-1 border rounded"
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label>Employee</label>
          <select
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mt-1 border rounded"
            required
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label>Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
          </div>
          <div>
            <label>Deadline</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label>From Time</label>
            <input type="time" name="from_time" value={formData.from_time} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
          </div>
          <div>
            <label>To Time</label>
            <input type="time" name="to_time" value={formData.to_time} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
          </div>
        </div>

        <div className="mb-4">
          <label>Venue</label>
          <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
        </div>

        <div className="mb-4">
          <label>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-2 border rounded">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Allocate Work</button>
      </form>
    </div>
  );
};

export default AddTask;
