import { useEffect, useState } from "react";
import axios from "axios";

const LeaveMetric = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchAvgAttendance = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/avg_attendance"); // Adjust baseURL as needed
        if (res.data.status) {
          setCount(res.data.Avg[0].average_attendance);
        }
      } catch (err) {
        console.error("Error fetching avg attendance:", err);
      }
    };

    fetchAvgAttendance();
  }, []);

  return (
    <div className="p-4 bg-white border border-blue-600 rounded-xl text-center">
      <h2 className="text-xl font-semibold text-gray-700">Avg Attendance</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default LeaveMetric;
