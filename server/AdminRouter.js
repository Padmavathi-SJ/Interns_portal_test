import express from 'express';
import Admins from './Routes/ADMIN/Admins.js';
import AdminLogin from './Routes/ADMIN/Login.js';
import Employees from './Routes/ADMIN/Employees.js';
import Departments from './Routes/ADMIN/Departments.js';
import Teams from './Routes/ADMIN/Teams.js';
import Leaves from './Routes/ADMIN/Leave.js';

const AdminRouter = express.Router();

AdminRouter.use("/admin", Admins);
AdminRouter.use("/admin", AdminLogin);
AdminRouter.use("/admin", Employees);
AdminRouter.use("/admin", Departments);
AdminRouter.use("/admin", Teams);
AdminRouter.use("/admin", Leaves);

export default AdminRouter;