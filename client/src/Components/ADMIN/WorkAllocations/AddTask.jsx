import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
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

    if (name === "employee_id") {
      axios.get(`http://localhost:3000/admin/pending_tasks/${value}`)
        .then((res) => {
          if (res.data.status) {
            setPendingTasks(res.data.pendingTasks);
          } else {
            setPendingTasks([]);
          }
        })
        .catch((err) => console.error("Error fetching pending tasks:", err));
    }
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
    <div className="p-3 rounded-lg max-w-6xl mx-auto">
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-20">
          {/* Column 1 */}
          <div className="space-y-4"> 
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

            {pendingTasks.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Pending Allocations</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {pendingTasks.map((task) => (
                <li key={task.id}>
                  <strong>{task.title}</strong> ({task.date} | {task.from_time} - {task.to_time}) at {task.venue}
                </li>
              ))}
            </ul>
          </div>
        )}

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

            <div className="mb-4">
              <label>Date</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                className="w-full border px-4 py-2 rounded" 
                required 
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="mb-4">
              <label>Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
            </div>

            <div className="mb-4">
              <label>From Time</label>
              <input type="time" name="from_time" value={formData.from_time} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
            </div>

            <div className="mb-4">
              <label>To Time</label>
              <input type="time" name="to_time" value={formData.to_time} onChange={handleInputChange} className="w-full border px-4 py-2 rounded" required />
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
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded mt-10 hover:bg-blue-700">Allocate Work</button>
      </form>
    </div>
  );
};

export default AddTask;
