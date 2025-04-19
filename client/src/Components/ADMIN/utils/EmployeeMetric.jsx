// src/utils/EmployeeMetric.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const EmployeeMetric = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/total_employees"); // Adjust baseURL as needed
        if (res.data.status) {
          setCount(res.data.TotalEmployees[0]["count(*)"]);
        }
      } catch (err) {
        console.error("Error fetching employee count:", err);
      }
    };

    fetchEmployeeCount();
  }, []);

  return (
    <div className="p-4 bg-white border border-blue-600 rounded-xl text-center">
      <h2 className="text-xl font-semibold text-gray-700">Total Employees</h2>
      <p className="text-3xl font-bold text-blue-600 mt-2">
        {count !== null ? count : "Loading..."}
      </p>
    </div>
  );
};

export default EmployeeMetric;
