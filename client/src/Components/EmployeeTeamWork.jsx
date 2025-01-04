import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EmployeeTeamWork = () => {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const { teamId } = useParams(); // Get team ID from the URL

  useEffect(() => {
    const fetchTeamTasks = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/auth/get_team_tasks/${teamId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` }, // Add token for authentication
          }
        );

        if (response.data.Status) {
          setTasks(response.data.Result);
        } else {
          setMessage(response.data.Message);
        }
      } catch (err) {
        console.error("Error fetching team tasks:", err);
        setMessage("Error fetching tasks. Please try again.");
      }
    };

    fetchTeamTasks();
  }, [teamId]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-center text-2xl font-semibold mb-6">Team Tasks</h2>
      {message && <p className="text-red-500 text-center">{message}</p>}
      {tasks.length > 0 ? (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="border p-4 rounded shadow-md hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p>
                <strong>Description:</strong> {task.description || "N/A"}
              </p>
              <p>
                <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Status:</strong> {task.status}
              </p>
              <p>
                <strong>Created At:</strong> {new Date(task.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !message && <p className="text-center">No tasks found.</p>
      )}
    </div>
  );
};

export default EmployeeTeamWork;
