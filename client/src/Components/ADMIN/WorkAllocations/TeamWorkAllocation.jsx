import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TeamWorkAllocation = () => {
  const [teams, setTeams] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    team_id: "",
    title: "",
    description: "",
    date: "",
    from_time: "",
    to_time: "",
    deadline: "",
    venue: "",
    priority: "Low",
    status: "Pending",
    created_at: new Date(),
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get("http://localhost:3000/admin/get-teams");
        setTeams(response.data.Teams || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if(name === "team_id") {
     // console.log("Selected team_id: ", value);
      axios.get(`http://localhost:3000/admin/pending_team_tasks/${value}`)
      .then((res) => {
       // console.log("Pending task response:", res.data);
        if(res.data.status) {
          setPendingTasks(res.data.pendingTasks);
        } else {
          setPendingTasks([]);
        }
      })
      .catch((err) => console.log("Error fetching pending tasks: ", err));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = [
      "team_id",
      "title",
      "description",
      "date",
      "from_time",
      "to_time",
      "deadline",
      "venue",
      "priority",
      "status",
      "created_at",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setMessage(`Please fill in the "${field}" field.`);
        return;
      }
    }

    try {
      const response = await axios.post("http://localhost:3000/admin/allocate_team_work", formData);

      if (response.data.status) {
        setMessage("Team work allocated successfully!");
        setTimeout(() => {
          navigate("/admin-dashboard/work_allocation");
        }, 2000);
      } else {
        setMessage("Failed to allocate team work.");
      }
    } catch (err) {
      console.error("Error allocating work:", err);
      setMessage("Server error while allocating work.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-blue-100 via-white to-blue-50 rounded-lg max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-blue-700 mb-6">Team Work Allocation</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Team Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Select Team</label>
          <select
            name="team_id"
            className="w-full px-4 py-2 mt-1 border rounded-md shadow-sm"
            value={formData.team_id}
            onChange={handleChange}
          >
            <option value="">Select a Team</option>
            {teams.map((team) => (
              <option key={team.team_id} value={team.team_id}>
                {team.team_name}
              </option>
            ))}
          </select>
        </div>

        {pendingTasks.length > 0 && (
  <div className="bg-yellow-100 p-4 rounded-md shadow">
    <h3 className="font-semibold text-yellow-800 mb-2">Pending Tasks for this Team</h3>
    <ul className="list-disc list-inside text-sm text-gray-700">
      {pendingTasks.map((task) => (
        <li key={task.team_id}>
          <strong>{task.title}</strong> - {task.date} ({task.from_time} to {task.to_time})
        </li>
      ))}
    </ul>
  </div>
)}


        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Task Title</label>
          <input
            name="title"
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-md"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            className="w-full px-4 py-2 mt-1 border rounded-md"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            name="date"
            type="date"
            className="w-full px-4 py-2 mt-1 border rounded-md"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        {/* From Time & To Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Time</label>
            <input
              name="from_time"
              type="time"
              className="w-full px-4 py-2 mt-1 border rounded-md"
              value={formData.from_time}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Time</label>
            <input
              name="to_time"
              type="time"
              className="w-full px-4 py-2 mt-1 border rounded-md"
              value={formData.to_time}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Deadline</label>
          <input
            name="deadline"
            type="date"
            className="w-full px-4 py-2 mt-1 border rounded-md"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Venue</label>
          <input
            name="venue"
            type="text"
            className="w-full px-4 py-2 mt-1 border rounded-md"
            value={formData.venue}
            onChange={handleChange}
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            className="w-full px-4 py-2 mt-1 border rounded-md"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            className="w-full px-4 py-2 mt-1 border rounded-md"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Allocate Work
        </button>
      </form>
    </div>
  );
};

export default TeamWorkAllocation;
