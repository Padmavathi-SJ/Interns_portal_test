import { useEffect, useState } from "react";
import axios from "axios";

const AdminsMetric = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchAdminsCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/admins_count"); // Adjust baseURL as needed
        if (res.data.status) {
          setCount(res.data.AdminCount[0]["count(*)"]);
        }
      } catch (err) {
        console.error("Error fetching admins count:", err);
      }
    };

    fetchAdminsCount();
  }, []);

  return (
    <div className="p-4 bg-white border border-blue-600 rounded-xl text-center">
      <h2 className="text-xl font-semibold text-gray-700">Total Admins</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default AdminsMetric;
