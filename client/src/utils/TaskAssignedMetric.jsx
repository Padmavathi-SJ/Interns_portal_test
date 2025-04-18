import { useEffect, useState } from "react";
import axios from "axios";

const TaskAssignedMetric = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchTaskAssignedCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/total_task_assigned_count"); // Adjust baseURL as needed
        if (res.data.status) {
          setCount(res.data.TaskAssignCount[0]["count(distinct employee_id)"]);
        }
      } catch (err) {
        console.error("Error fetching task asigned count:", err);
      }
    };

    fetchTaskAssignedCount ();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-xl text-center">
      <h2 className="text-xl font-semibold text-gray-700">Tasks Assigned</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default TaskAssignedMetric;
