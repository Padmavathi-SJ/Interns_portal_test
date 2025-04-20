import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditAnnouncement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: 'department',
    title: '',
    description: '',
    extra_info: '',
    priority: 'normal',
    target: [],
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selection, setSelection] = useState('');

  // Fetch dropdown data and existing announcement
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, empRes, teamRes, announcementRes] = await Promise.all([
          axios.get("http://localhost:3000/admin/get-departments"),
          axios.get("http://localhost:3000/admin/get-employees"),
          axios.get("http://localhost:3000/admin/get-teams"),
          
        ]);

        setDepartments(deptRes.data.Departments || []);
        setEmployees(empRes.data.Employees || []);
        setTeams(teamRes.data.Teams || []);

        const announcement = announcementRes.data;
        setFormData({
          category: announcement.category,
          title: announcement.title,
          description: announcement.description,
          extra_info: announcement.extra_info,
          priority: announcement.priority,
          target: announcement.target,
        });

        // Pre-select the option for target
        if (announcement.target.length > 0) {
          setSelection(announcement.target[0]);
        }

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'category') {
      setSelection('');
      setFormData((prev) => ({ ...prev, target: [] }));
    }
  };

  const handleSelectionChange = async (e) => {
    const selectedId = e.target.value;
    setSelection(selectedId);
  
    if (!selectedId) return;
  
    let url = "";
    if (formData.category === "department") {
      url = `http://localhost:3000/admin/get-employees/${selectedId}`;
    } else if (formData.category === "team") {
      url = `http://localhost:3000/admin/get-team-employees/${selectedId}`;
    } else if (formData.category === "individual") {
      setFormData(prev => ({ ...prev, target: [selectedId] }));
      return;
    }
  
    try {
      const res = await axios.get(url);
      let empIds = [];
  
      if (formData.category === 'team') {
        empIds = res.data.TeamEmployees || [];
      } else {
        empIds = res.data.Employees?.map((emp) => emp.id) || [];
      }
  
      setFormData((prev) => ({ ...prev, target: empIds }));
    } catch (err) {
      console.error("Error fetching target employees:", err);
    }
  };
  

  const renderTargetOptions = () => {
    switch (formData.category) {
      case 'individual':
        return (
          <select
            value={selection}
            onChange={handleSelectionChange}
            className="w-full px-4 py-2 mt-1 border rounded-md"
          >
            <option value="">Select Employee</option>
            {Array.isArray(employees) && employees.map(emp => (
  <option key={emp.id} value={emp.id}>{emp.name}</option>
))}
          </select>
        );
      case 'team':
        return (
          <select
            value={selection}
            onChange={handleSelectionChange}
            className="w-full px-4 py-2 mt-1 border rounded-md"
          >
            <option value="">Select Team</option>
            {Array.isArray(teams) && teams.map(team => (
  <option key={team.team_id} value={team.team_id}>{team.team_name}</option>
))}

          </select>
        );
      case 'department':
        return (
          <select
            value={selection}
            onChange={handleSelectionChange}
            className="w-full px-4 py-2 mt-1 border rounded-md"
          >
            <option value="">Select Department</option>
            <option value="">Select Department</option>
          {Array.isArray(departments) && departments.map(dept => (
  <option key={dept.id} value={dept.id}>{dept.name}</option>
))}
          </select>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:3000/admin/update_announcement/${id}`, formData);
      navigate('/admin-dashboard/manage_announcements');
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Edit Announcement</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
          >
            <option value="department">Department</option>
            <option value="individual">Individual</option>
            <option value="team">Team</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Target</label>
          {renderTargetOptions()}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter announcement title"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            placeholder="Enter announcement description"
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Extra Info</label>
          <textarea
            name="extra_info"
            value={formData.extra_info}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
            placeholder="Optional extra information"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-indigo-600"
        >
          Update Announcement
        </button>
      </form>
    </div>
  );
};

export default EditAnnouncement;
