import EmployeeMetric from "../../utils/EmployeeMetric";
import DepartmentMetric from "../../utils/DepartmentMetric";
import TeamMetric from "../../utils/TeamMetric";

const DashboardMetric = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-6">
      <EmployeeMetric />
      <DepartmentMetric />
      <TeamMetric />
      {/* Add other metric cards here like <TeamMetric />, <TaskMetric />, etc. */}
    </div>
  );
};

export default DashboardMetric;
