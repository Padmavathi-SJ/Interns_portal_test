import React from "react";
import Profile from "./utils/Profile";

const Topbar = () => {
  return (
    <div className="flex justify-between items-center h-5 bg-white px-2 shadow-sm">
      {/* Title */}
      <div >
     <h4 className="text-gray-800 text-lg font-semibold">Dashboard</h4>

     </div>

      {/* Profile */}
      <Profile />
    </div>
  );
};

export default Topbar;
