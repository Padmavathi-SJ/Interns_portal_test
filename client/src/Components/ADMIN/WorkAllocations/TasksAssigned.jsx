import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TasksAssigned = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/admin/get_allTasks')
      .then(response => {
        if (Array.isArray(response.data.Tasks)) {
          setTasks(response.data.Tasks);
        } else {
          console.error('Tasks is not an array:', response.data);
          setTasks([]); // Fallback to empty array
        }
      })
      .catch(error => console.error('Error fetching employee tasks:', error));
  }, []);

  // Function to format the date
  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    return formattedDate;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Tasks Assigned</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2">Employee Name</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Venue</th>
              <th className="px-4 py-2">Priority</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={idx} className="border-b text-center">
                <td className="px-4 py-2">{task.employee_name}</td>
                <td className="px-4 py-2">{task.department_name}</td>
                <td className="px-4 py-2">{formatDate(task.date)}</td> {/* Format the date */}
                <td className="px-4 py-2">{task.from_time} - {task.to_time}</td>
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

export default TasksAssigned;
