import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TaskStatusChart = () => {
  const [date, setDate] = useState("");
  const [statusData, setStatusData] = useState(null);

  const fetchStatus = async (selectedDate) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/task_status_by_date?date=${selectedDate}`);
      if (res.data.status) {
        const { total, completed, pending, in_progress } = res.data.taskStatus;
        setStatusData([
          { name: "Status", total: total, completed: completed, pending: pending, in_progress: in_progress },
        ]);
      }
    } catch (err) {
      console.error("Error fetching status data:", err);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
    fetchStatus(today);
  }, []);

  const handleChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchStatus(newDate);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-4">
      <div className="mb-4">
        <label className="font-semibold text-gray-700">Interns Tasks:</label>
        <input
          type="date"
          value={date}
          onChange={handleChange}
          className="ml-2 border px-2 py-1 rounded"
        />
      </div>
      {statusData && (
        <ResponsiveContainer width={375} height={300}>
          <BarChart data={statusData} barGap={20}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#3182ce" name="Total" barSize={35} />
            <Bar dataKey="completed" fill="#38a169" name="Completed" barSize={35} />
            <Bar dataKey="pending" fill="#e53e3e" name="Pending" barSize={35} />
            <Bar dataKey="in_progress" fill="#f6ad55" name="In Progress" barSize={35} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TaskStatusChart;
