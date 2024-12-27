import Login from './Components/login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Department from './Components/Department';
import AddDepartment from './Components/AddDepartment';
import AddEmployee from './Components/AddEmployee';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/adminLogin" element={<Login />} />
        <Route path="/admin-dashboard" element={<Dashboard />}>
          <Route index element={<Home />} /> 
          <Route path="employee" element={<Employee />} /> 
          <Route path="employee/add_employee" element={<AddEmployee />} /> 
          <Route path="department" element={<Department />} />
          <Route path="department/add_department" element={<AddDepartment />} /> {/* This will render when accessing "/admin-dashboard/department" */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
