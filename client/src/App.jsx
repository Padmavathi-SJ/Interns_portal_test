import Login from './Components/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';  // Admin Dashboard layout
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
import EmployeeDashboard from './Components/EmployeeDashboard';  // Employee Dashboard layout
import EmployeeHome from './Components/EmployeeHome';
import Profile from './Components/Profile';
import EmployeeTask from './Components/EmployeeTask';
import ApplyLeave from './Components/ApplyLeave';
import EmployeeLeave from './Components/EmployeeLeave';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Routes */}
        <Route path="/adminLogin" element={<Login />} />
        <Route path="/admin-dashboard" element={<Dashboard />}>
          <Route index element={<Home />} /> 
          <Route path="employee" element={<Employee />} /> 
          <Route path="employee/add_employee" element={<AddEmployee />} /> 
          <Route path="employee/edit_employee/:employeeId" element={<EditEmployee />} /> 
          <Route path="department" element={<Department />} />
          <Route path="department/add_department" element={<AddDepartment />} /> 
          <Route path="work_allocation" element={<WorkAllocation />} /> 
          <Route path="allocate_work" element={<AddTask />} />
          <Route path="edit_work/:taskId" element={<EditTask />} />
          <Route path="leave" element={<Leave />} />
        </Route>

        {/* User (Employee) Routes */}
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} >
          <Route index element={<EmployeeHome />} /> 
          <Route path="profile" element={<Profile />} /> 
          <Route path="employee_task" element={<EmployeeTask />} /> 
          <Route path="employee_leave" element={<EmployeeLeave />} /> 
          <Route path="apply_leave" element={<ApplyLeave />} /> 
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
