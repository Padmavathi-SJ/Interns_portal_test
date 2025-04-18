import React from "react";
import Topbar from "./TopBar";
import DashboardMetric from "./DashboardMetrics";

const Home = () => {
  return (
    <div>
      {/* Topbar at the top */}
      <Topbar />

      {/* Main Dashboard Content */}
      <div className="p-4">
        <DashboardMetric />
      </div>
    </div>
  );
};

export default Home;
