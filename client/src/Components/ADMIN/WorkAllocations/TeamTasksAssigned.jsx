import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeamTasksAssigned = () => {
  const [teamTasks, setTeamTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/admin/get_allTeamTasks')
      .then(response => {
        console.log("Fetched team tasks:", response.data); // Optional debug
        const tasks = response.data?.TeamTasks || [];
        setTeamTasks(tasks);
      })
      .catch(error => {
        console.error('Error fetching team tasks:', error);
        setTeamTasks([]); // fallback
      });
  }, []);
  
  

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(date).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Team Tasks Assigned</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2">Team Id</th>
              <th className="px-4 py-2">Team Strength</th>
              <th className="px-4 py-2">Assigned Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Deadline</th>
              <th className="px-4 py-2">Venue</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {teamTasks.map((task, idx) => (
              <tr key={idx} className="border-b text-center">
                <td className="px-4 py-2">{task.team_id}</td>
                <td className="px-4 py-2">{task.team_strength}</td>
                <td className="px-4 py-2">{formatDate(task.assigned_date)}</td>
                <td className="px-4 py-2">{task.from_time} - {task.to_time}</td>
                <td className="px-4 py-2">{formatDate(task.deadline)}</td>
                <td className="px-4 py-2">{task.venue}</td>
                <td className="px-4 py-2">{task.priority}</td>
                <td className="px-4 py-2">{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamTasksAssigned;
