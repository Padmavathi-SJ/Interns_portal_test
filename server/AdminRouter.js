import express from 'express';
import Admins from './Routes/ADMIN/Admins.js';
import AdminLogin from './Routes/ADMIN/Login.js';
import Employees from './Routes/ADMIN/Employees.js';

const AdminRouter = express.Router();

AdminRouter.use("/admin", Admins);
AdminRouter.use("/admin", AdminLogin);
AdminRouter.use("/admin", Employees);

export default AdminRouter;