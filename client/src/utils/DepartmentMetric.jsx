import { useEffect, useState } from "react";
import axios from "axios";

const DepartmentMetric = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchDepartmentCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/total_departments"); // Adjust baseURL as needed
        if (res.data.status) {
          setCount(res.data.TotalDepartments[0]["count(*)"]);
        }
      } catch (err) {
        console.error("Error fetching department count:", err);
      }
    };

    fetchDepartmentCount();
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-xl text-center">
      <h2 className="text-xl font-semibold text-gray-700">Total Departments</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default DepartmentMetric;
