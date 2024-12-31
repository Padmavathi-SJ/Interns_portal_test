import Login from './Components/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard'; // Admin Dashboard layout
import Home from './Components/Home';
import Employee from './Components/Employee';
import Department from './Components/Department';
import AddDepartment from './Components/AddDepartment';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';
import Leave from './Components/Leave';
import WorkAllocation from './Components/WorkAllocation';
import AddTask from './Components/AddTask';
import EditTask from './Components/EditTask';
import UserLogin from './Components/UserLogin';
import EmployeeDashboard from './Components/EmployeeDashboard'; // Employee Dashboard layout
import EmployeeHome from './Components/EmployeeHome';
import Profile from './Components/Profile';
import EmployeeTask from './Components/EmployeeTask';
import ApplyLeave from './Components/ApplyLeave';
import EmployeeLeave from './Components/EmployeeLeave';
import EmployeeList from './Components/EmployeeList';
import EmployeeDetails from './Components/EmployeeDetails';
import Anouncements from './Components/Anouncements';
import AdminFeedback from './Components/AdminFeedback';
import EmployeeFeedback from './Components/EmployeeFeedback';
import AddFeedback from './Components/AddFeedback';
import TeamManagement from './Components/TeamManagement';
import TeamCreation from './Components/TeamCreation';
import EditTeam from './Components/EditTeam';
import EmployeeProfile from './Components/EmployeeProfile';
import MyTeam from './Components/MyTeam';
import ManageAnnouncements from './Components/ManageAnnouncements';

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
          <Route path="department/:departmentId/employees" element={<EmployeeList />} />
          <Route path="employee/:employeeId/details" element={<EmployeeDetails />} />
          <Route path="department/add_department" element={<AddDepartment />} />
          <Route path="work_allocation" element={<WorkAllocation />} />
          <Route path="allocate_work" element={<AddTask />} />
          <Route path="edit_work/:taskId" element={<EditTask />} />
          <Route path="teams" element={<TeamManagement />} />
          <Route path="team_creation" element={<TeamCreation />} />
          <Route path="teams/edit_team/:team_id" element={<EditTeam />} />
          <Route path="leave" element={<Leave />} />
          <Route path="feedback" element={<AdminFeedback/>} />
          <Route path="manage_announcements" element={<ManageAnnouncements/>} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
