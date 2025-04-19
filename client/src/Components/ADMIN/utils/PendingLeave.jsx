import { useEffect, useState } from "react";
import axios from "axios";

const PendingLeave = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchPendingLeaveCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/pending_leaves_count"); // Adjust baseURL as needed
        if (res.data.status) {
          setCount(res.data.PendingCount[0]["count(*)"]);
        }
      } catch (err) {
        console.error("Error fetching pending leaves count:", err);
      }
    };

    fetchPendingLeaveCount();
  }, []);

  return (
    <div className="p-4 bg-white border border-blue-600 rounded-xl text-center">
      <h2 className="text-xl font-semibold text-gray-700">Pedning Leave Approvals</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default PendingLeave;
