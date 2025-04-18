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
        setTeams(response.data.teams || []);
      } catch (err) {
        setMessage("Failed to fetch teams");
        console.error("Error fetching teams:", err);
      }
    };
    fetchTeams();
  }, []);

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    setFormData({ ...formData, team_id: teamId });

    if (teamId) {
      axios.get(`http://localhost:3000/admin/pending_team_tasks/${teamId}`)
        .then((res) => {
          if (res.data.status) {
            setPendingTasks(res.data.pendingTasks);
          } else {
            setPendingTasks([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching pending tasks:", err);
        });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = ["team_id", "title", "date", "from_time", "to_time", "venue", "priority", "deadline"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        setMessage("Please fill all required fields.");
        return;
      }
    }

    axios.post("http://localhost:3000/admin/allocate_team_work", formData)
      .then((res) => {
        if (res.data.status) {
          setMessage("Work allocated to team successfully!");
          navigate("/admin-dashboard/team_work_allocation");
        } else {
          setMessage("Error allocating work to the team.");
        }
      }).catch((err) => {
        setMessage("Error allocating work to team.");
        console.error("Error in allocating team work:", err);
      });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-green-100 via-white to-green-50 rounded-lg max-w-2xl mx-auto shadow-md">
      <h2 className="text-2xl font-semibold text-green-700 mb-6">Allocate Work to Team</h2>
      {message && <p className="mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm font-medium">Team</label>
          <select
            name="team_id"
            value={formData.team_id}
            onChange={handleTeamChange}
            className="w-full px-4 py-2 mt-1 border rounded"
            required
          >
            <option value="">-- Select Team --</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>
        </div>

        {pendingTasks.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Pending Tasks</h3>
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
          <label className="text-sm font-medium">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">From Time</label>
            <input
              type="time"
              name="from_time"
              value={formData.from_time}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">To Time</label>
            <input
              type="time"
              name="to_time"
              value={formData.to_time}
              onChange={handleInputChange}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Venue</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Allocate Team Work</button>
      </form>
    </div>
  );
};

export default TeamWorkAllocation;
