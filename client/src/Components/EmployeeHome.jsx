import React from 'react';
import Profile from './Profile';

const EmployeeHome = () => {
  return (
    <div>
      <div className="w-full sm:w-1/4 p-6 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-300 dark:border-gray-700 rounded-lg">
        <Profile /> 
      </div>
    </div>
  );
};

export default EmployeeHome;
