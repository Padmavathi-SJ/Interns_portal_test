import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AnnouncementForm = () => {
  const [formData, setFormData] = useState({
    category: "department",
    title: "",
    description: "",
    extraInfo: "",
    priority: "normal",
    target: [], // employee ids
  });

  const [departments, setDepartments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selection, setSelection] = useState(""); // department id, team id, or employee id

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/admin/get-departments").then(res => {
      console.log("Departments:", res.data);
      setDepartments(res.data.Departments);
    });
  
    axios.get("http://localhost:3000/admin/get-employees").then(res => {
      console.log("Employees:", res.data);
      setEmployees(res.data.Employees);
    });
  
    axios.get("http://localhost:3000/admin/get-teams").then(res => {
      console.log("Teams:", res.data);
      setTeams(res.data.Teams);
    });
  }, []);
  

  const fetchTargetEmployees = async (category, selectedId) => {
    if (!selectedId) return;
  
    let url = "";
    if (category === "department") url = `http://localhost:3000/admin/get-employees/${selectedId}`;
    if (category === "team") url = `http://localhost:3000/admin/get-team-employees/${selectedId}`;
    if (category === "individual") {
      setFormData(prev => ({ ...prev, target: [selectedId] }));
      return;
    }
  
    try {
      const res = await axios.get(url);
      let empIds = [];
  
      if (category === "team") {
        empIds = res.data.TeamEmployees || [];
      } else {
        empIds = res.data.Employees?.map(emp => emp.id) || [];
      }
  
      setFormData(prev => ({ ...prev, target: empIds }));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setFormData(prev => ({ ...prev, category: newCategory, target: [] }));
    setSelection("");
  };

  const handleSelectionChange = async (e) => {
    const selectedId = e.target.value;
    setSelection(selectedId);
    await fetchTargetEmployees(formData.category, selectedId);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      ...formData,
      extra_info: formData.extraInfo,
      target_ids: formData.target,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    try {
      const res = await axios.post("http://localhost:3000/admin/add_announcement", payload);
      alert("Announcement Posted Successfully!");
      navigate("/admin-dashboard/manage_announcements");
    } catch (error) {
      console.error("Error posting announcement:", error);
      alert("Error posting announcement.");
    }
  };

  const renderSelectionOptions = () => {
    const category = formData.category;
    if (category === "department") {
      return (
        <select value={selection} onChange={handleSelectionChange} className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm">
          <option value="">Select Department</option>
          {Array.isArray(departments) && departments.map(dept => (
  <option key={dept.id} value={dept.id}>{dept.name}</option>
))}
        </select>
      );
    }
    if (category === "team") {
      return (
        <select value={selection} onChange={handleSelectionChange} className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm">
          <option value="">Select Team</option>
          {Array.isArray(teams) && teams.map(team => (
  <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
))}

        </select>
      );
    }
    if (category === "individual") {
      return (
        <select value={selection} onChange={handleSelectionChange} className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm">
          <option value="">Select Employee</option>
          {Array.isArray(employees) && employees.map(emp => (
  <option key={emp.id} value={emp.id}>{emp.name}</option>
))}
        </select>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Create Announcement</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" value={formData.category} onChange={handleCategoryChange} className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm">
            <option value="department">Department</option>
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
        </div>

        {/* Select Department / Team / Individual */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Select {formData.category}</label>
          {renderSelectionOptions()}
        </div>

        {/* Form Details */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Extra Info</label>
          <textarea name="extraInfo" value={formData.extraInfo} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm" />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Post Announcement</button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
