import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'all',
    target_ids: [],
    title: '',
    description: '',
    extra_info: '',
    priority: 'normal',
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch the specific announcement details
    axios.get(`http://localhost:3000/auth/announcements/${id}`)
      .then(res => setFormData(res.data))
      .catch(err => console.error("Error fetching announcement details", err));

    // Fetch dropdown data
    axios.get("http://localhost:3000/auth/get_departments").then(res => setDepartments(res.data.Result));
    axios.get("http://localhost:3000/auth/get_employees").then(res => setEmployees(res.data.Result));
    axios.get("http://localhost:3000/auth/get_teams").then(res => setTeams(res.data.Result));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "category") {
      setFormData(prev => ({ ...prev, target_ids: [] }));
    }
  };

  const handleTargetSelection = e => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, target_ids: selectedOptions }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`http://localhost:3000/auth/announcements/${id}`, formData)
      .then(res => {
        alert(res.data.Message);
        navigate("/admin-dashboard/manage_announcements");
      })
      .catch(err => console.error("Error updating announcement", err));
  };

  const renderTargetOptions = () => {
    if (formData.category === 'individual') {
      return (
        <select multiple name="target_ids" value={formData.target_ids} onChange={handleTargetSelection} className="w-full p-2 mb-4 border rounded-md">
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      );
    }
    if (formData.category === 'team') {
      return (
        <select multiple name="target_ids" value={formData.target_ids} onChange={handleTargetSelection} className="w-full p-2 mb-4 border rounded-md">
          {teams.map(team => (
            <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
          ))}
        </select>
      );
    }
    if (formData.category === 'all') {
      return (
        <select multiple name="target_ids" value={formData.target_ids} onChange={handleTargetSelection} className="w-full p-2 mb-4 border rounded-md">
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>
      );
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Edit Announcement</h2>
      <label className="block mb-2 text-sm font-medium">Category</label>
      <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md">
        <option value="all">All</option>
        <option value="individual">Individual</option>
        <option value="team">Team</option>
      </select>
      <label className="block mb-2 text-sm font-medium">Target</label>
      {renderTargetOptions()}
      <label className="block mb-2 text-sm font-medium">Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter announcement title" required className="w-full p-2 mb-4 border rounded-md" />
      <label className="block mb-2 text-sm font-medium">Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Enter announcement description" required className="w-full p-2 mb-4 border rounded-md" />
      <label className="block mb-2 text-sm font-medium">Extra Info</label>
      <textarea name="extra_info" value={formData.extra_info} onChange={handleChange} placeholder="Optional extra information" className="w-full p-2 mb-4 border rounded-md" />
      <label className="block mb-2 text-sm font-medium">Priority</label>
      <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 mb-4 border rounded-md">
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
        <option value="urgent">Urgent</option>
      </select>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
        Update Announcement
      </button>
    </form>
  );
};

export default EditAnnouncement;
