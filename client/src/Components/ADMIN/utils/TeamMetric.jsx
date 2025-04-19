import { useEffect, useState } from "react";
import axios from "axios";

const TeamMetric = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchTeamCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/total_teams"); // Adjust baseURL as needed
        if (res.data.status) {
          setCount(res.data.TotalTeams[0]["count(*)"]);
        }
      } catch (err) {
        console.error("Error fetching teams count:", err);
      }
    };

    fetchTeamCount();
  }, []);

  return (
    <div className="p-4 bg-white border border-blue-600 rounded-xl text-center">
      <h2 className="text-xl font-semibold text-gray-700">Total Teams</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default TeamMetric;
