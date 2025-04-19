import Login from './Components/ADMIN/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/ADMIN/Dashboard'; // Admin Dashboard layout
import Home from './Components/ADMIN/Home';
import Employee from './Components/ADMIN/Employees/Employee';
import Department from './Components/ADMIN/Departments/Department';
import AddDepartment from './Components/ADMIN/Departments/AddDepartment';
import AddEmployee from './Components/ADMIN/Employees/AddEmployee';
import EditEmployee from './Components/ADMIN/Employees/EditEmployee';
import Leave from './Components/ADMIN/Leave/Leave';
import WorkAllocation from './Components/ADMIN/WorkAllocations/WorkAllocation';
import AddTask from './Components/ADMIN/WorkAllocations/AddTask';
import EditTask from './Components/ADMIN/WorkAllocations/EditTask';
import UserLogin from './Components/USER/UserLogin';
import EmployeeDashboard from './Components/USER/Dashboard-Metrics/EmployeeDashboard'; // Employee Dashboard layout
import EmployeeHome from './Components/USER/Dashboard-Metrics/EmployeeHome';
import Profile from './Components/USER/Dashboard-Metrics/Profile';
import EmployeeTask from './Components/USER/Works/EmployeeTask';
import ApplyLeave from './Components/USER/Leave/ApplyLeave';
import EmployeeLeave from './Components/USER/Leave/EmployeeLeave';
import EmployeeList from './Components/ADMIN/Departments/EmployeeList';
import EmployeeDetails from './Components/ADMIN/Departments/EmployeeDetails';
import Anouncements from './Components/USER/Announcements/Anouncements';
import AdminFeedback from './Components/ADMIN/Feedback/AdminFeedback';
import EmployeeFeedback from './Components/USER/Feedback/EmployeeFeedback';
import AddFeedback from './Components/USER/Feedback/AddFeedback';
import TeamManagement from './Components/ADMIN/Teams/TeamManagement';
import TeamCreation from './Components/ADMIN/Teams/TeamCreation';
import EditTeam from './Components/ADMIN/Teams/EditTeam';
import EmployeeProfile from './Components/USER/Dashboard-Metrics/EmployeeProfile';
import MyTeam from './Components/USER/Team/MyTeam';
import ManageAnnouncements from './Components/ADMIN/Announcements/ManageAnnouncements';
import Admins from './Components/ADMIN/Admin/Admins';
import AddAdmin from './Components/ADMIN/Admin/AddAdmin';
import TeamWorkAllocation from './Components/ADMIN/WorkAllocations/TeamWorkAllocation';
import EmployeeTeamWork from './Components/USER/Team/EmployeeTeamWork';
import AnnouncementForm from './Components/ADMIN/Announcements/AnnouncementsForm';
import EditAnnouncement from './Components/ADMIN/Announcements/EditAnnouncement';
import EditDepartment from './Components/ADMIN/Departments/EditDepartment';
import EditTeamTask from './Components/ADMIN/WorkAllocations/EditTeamTask';
import TasksAssigned from './Components/ADMIN/WorkAllocations/TasksAssigned';
import TeamTasksAssigned from './Components/ADMIN/WorkAllocations/TeamTasksAssigned';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/adminLogin" element={<Login />} />
        <Route path="/admin-dashboard" element={<Dashboard />}>
          <Route index element={<Home />} /> {/* Default Dashboard Home */}
          <Route path="employee" element={<Employee />} />
          <Route path="employee/add_employee" element={<AddEmployee />} />
          <Route path="employee/edit_employee/:employeeId" element={<EditEmployee />} />
          <Route path="department" element={<Department />} />
          <Route path="edit_department/:departmentId" element={<EditDepartment />} />
          <Route path="department/:departmentId/employees" element={<EmployeeList />} />
          <Route path="employee/:employeeId/details" element={<EmployeeDetails />} />
          <Route path="department/add_department" element={<AddDepartment />} />
          <Route path="work_allocation" element={<WorkAllocation />} />
          <Route path="allocate_work" element={<AddTask />} />
          <Route path="edit_work/:taskId" element={<EditTask />} />
          <Route path="edit_team_work/:taskId" element={<EditTeamTask />} />
          <Route path="teams" element={<TeamManagement />} />
          <Route path="team_creation" element={<TeamCreation />} />
          <Route path="teams/edit_team/:team_id" element={<EditTeam />} />
          <Route path="leave" element={<Leave />} />
          <Route path="feedback" element={<AdminFeedback/>} />
          <Route path="manage_announcements" element={<ManageAnnouncements/>} />
          <Route path="push_announcements" element={<AnnouncementForm/>} />
          <Route path="edit_announcement/:id" element={<EditAnnouncement/>} />
          <Route path="admins" element={<Admins/>} />
          <Route path="add_admin" element={<AddAdmin/>} />
          <Route path="team_work_allocation" element={<TeamWorkAllocation/>} />
          <Route path="tasks_assigned" element={<TasksAssigned />} />
          <Route path="team_tasks_assigned" element={<TeamTasksAssigned />} />
        </Route>

        {/* User (Employee) Routes */}
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />}>
          <Route index element={<EmployeeHome />} /> {/* Default Employee Home */}
          <Route path="profile" element={<Profile />} /> 
          <Route path="employee_task" element={<EmployeeTask />} />
          <Route path="employee_leave" element={<EmployeeLeave />} />
          <Route path="apply_leave" element={<ApplyLeave />} />
          <Route path="feedback" element={<EmployeeFeedback />} />
          <Route path="add_feedback" element={<AddFeedback />} />
          <Route path="anouncements" element={<Anouncements />} />
          <Route path="my_profile" element={<EmployeeProfile/>} />
          <Route path="my_team" element={<MyTeam/>} />
          <Route path="team_tasks/:teamId" element={<EmployeeTeamWork/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
