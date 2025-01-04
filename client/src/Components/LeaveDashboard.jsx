import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarIcon, ClipboardListIcon, BriefcaseIcon, CheckCircleIcon, ChartPieIcon } from '@heroicons/react/solid';

const LeaveDashboard = () => {
  const [leaveData, setLeaveData] = useState(null);
  const [error, setError] = useState("");

  // Fetch leave dashboard data on component mount
  useEffect(() => {
    const fetchLeaveDashboardData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("No token found, please log in.");
          return;
        }

        const response = await axios.get("http://localhost:3000/auth/leave_dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.Status) {
          setLeaveData(response.data.Data); // Set the leave data
        } else {
          setError(response.data.Message || "No leave data found.");
        }
      } catch (err) {
        setError("An error occurred while fetching leave data.");
        console.error("Error:", err.response ? err.response.data : err);
      }
    };

    fetchLeaveDashboardData();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-red-100 text-red-600 p-4 rounded-md shadow-md max-w-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!leaveData) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"> {/* 2 columns grid layout */}

        {/* Column 1 */}
        <div className="space-y-6">
          {/* Total Days in Month */}
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-12 w-12 text-blue-500" />
            <div className="flex flex-col items-start">
              <p className="text-gray-600">Total Days</p>
              <h3 className="font-semibold text-xl">{leaveData.totalDaysInMonth}</h3>
            </div>
          </div>

          {/* Leave Days */}
          <div className="flex items-center space-x-2">
            <ClipboardListIcon className="h-12 w-12 text-yellow-500" />
            <div className="flex flex-col items-start">
              <p className="text-gray-600">Leave</p>
              <h3 className="font-semibold text-xl">{leaveData.totalLeaveDays}</h3>
            </div>
          </div>

          {/* On Duty Days */}
          <div className="flex items-center space-x-2">
            <BriefcaseIcon className="h-12 w-12 text-green-500" />
            <div className="flex flex-col items-start">
              <p className="text-gray-600">On Duty</p>
              <h3 className="font-semibold text-xl">{leaveData.onDutyDays}</h3>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          {/* Present Days */}
          <div className="flex items-center space-x-2">
            <CheckCircleIcon className="h-12 w-12 text-indigo-500" />
            <div className="flex flex-col items-start">
              <p className="text-gray-600">Present</p>
              <h3 className="font-semibold text-xl">{leaveData.presentDays}</h3>
            </div>
          </div>

          {/* Present Percentage */}
          <div className="flex items-center space-x-2">
            <ChartPieIcon className="h-12 w-12 text-purple-500" />
            <div className="flex flex-col items-start">
              <p className="text-gray-600">Percentage</p>
              <h3 className="font-semibold text-xl">{leaveData.presentPercentage} %</h3>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeaveDashboard;
