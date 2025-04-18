import EmployeeMetric from "../../utils/EmployeeMetric";
import DepartmentMetric from "../../utils/DepartmentMetric";
import TeamMetric from "../../utils/TeamMetric";
import TaskAssignedMetric from "../../utils/TaskAssignedMetric";
import TaskStatusChart from "../../utils/TaskStatusChart";
import TeamTaskStatusChart from "../../utils/TeamTaskStatusChart";
import LeaveMetric from "../../utils/LeaveMetric";
import PendingLeave from "../../utils/PendingLeave";
import PendingFeedback from "../../utils/PendingFeedback";
import AdminsMetric from "../../utils/AdminsMetric";


const DashboardMetric = () => {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      {/* Metric Cards Row */}
      <div className="flex flex-wrap justify-between gap-4">
        <div className="w-[23%] min-w-[150px]">
          <EmployeeMetric />
        </div>
        <div className="w-[23%] min-w-[150px]">
          <DepartmentMetric />
        </div>
        <div className="w-[23%] min-w-[150px]">
          <TeamMetric />
        </div>
        <div className="w-[23%] min-w-[150px]">
          <TaskAssignedMetric />
        </div>
        <div className="w-[23%] min-w-[150px]">
          <LeaveMetric />
        </div>
        <div className="w-[23%] min-w-[150px]">
          <PendingLeave />
        </div>
        <div className="w-[23%] min-w-[150px]">
          <PendingFeedback />
        </div>
        <div className="w-[23%] min-w-[150px]">
          <AdminsMetric />
        </div>
      </div>

      {/* Charts Row */}
      <div className="flex flex-wrap gap-4 justify-between">
        <div>
          <TaskStatusChart />
        </div>
        <div>
          <TeamTaskStatusChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetric;
