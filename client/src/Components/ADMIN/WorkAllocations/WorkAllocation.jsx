import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaUsers, FaTasks, FaClipboardList } from 'react-icons/fa';
import AddTask from './AddTask';
import AddTeamTask from './TeamWorkAllocation';

const WorkAllocation = () => {
  const [activeComponent, setActiveComponent] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 w-full justify-around">
          <button
            onClick={() => setActiveComponent('employee')}
            className={`flex flex-col items-center justify-center p-3 rounded-md shadow transition w-full ${
              activeComponent === 'employee'
                ? 'bg-blue-300 text-white'
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
            }`}
          >
            <FaUserTie className="text-2xl mb-1" />
            <span className="text-sm font-medium">Allocate Work (Employee)</span>
          </button>

          <button
            onClick={() => setActiveComponent('team')}
            className={`flex flex-col items-center justify-center p-3 rounded-md shadow transition w-full ${
              activeComponent === 'team'
                ? 'bg-green-300 text-white'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            <FaUsers className="text-2xl mb-1" />
            <span className="text-sm font-medium">Allocate Work (Team)</span>
          </button>

          <button
            onClick={() => navigate('/admin-dashboard/tasks_assigned')}
            className="flex flex-col items-center justify-center bg-yellow-100 text-yellow-800 p-3 rounded-md shadow hover:bg-yellow-200 transition w-full"
          >
            <FaTasks className="text-2xl mb-1" />
            <span className="text-sm font-medium">Tasks Assigned (Employee)</span>
          </button>

          <button
            onClick={() => navigate('/admin-dashboard/team_tasks_assigned')}
            className="flex flex-col items-center justify-center bg-purple-100 text-purple-800 p-3 rounded-md shadow hover:bg-purple-200 transition w-full"
          >
            <FaClipboardList className="text-2xl mb-1" />
            <span className="text-sm font-medium">Tasks Assigned (Team)</span>
          </button>
        </div>
      </div>

      {/* Main Content - Render Only When Active Component Is Selected */}
      {activeComponent && (
        <div className="p-3 rounded-lg mt-20">
          {activeComponent === 'employee' && <AddTask />}
          {activeComponent === 'team' && <AddTeamTask />}
        </div>
      )}
    </div>
  );
};

export default WorkAllocation;
