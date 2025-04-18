import express from 'express';
import Admins from './Routes/ADMIN/Admins.js';
import AdminLogin from './Routes/ADMIN/Login.js';
import Employees from './Routes/ADMIN/Employees.js';
import Departments from './Routes/ADMIN/Departments.js';
import Teams from './Routes/ADMIN/Teams.js';
import Leaves from './Routes/ADMIN/Leave.js';
import Feedbacks from './Routes/ADMIN/Feedback.js';
import WorkAllocation from './Routes/ADMIN/WorkAllocations.js'
import TeamWorkAllocation from './Routes/ADMIN/TeamWorkAllocation.js';
import Dashboard from './Routes/ADMIN/Dashboard.js';
import AdminProfile from './Routes/ADMIN/AdminProfile.js';
import Performance from './Routes/ADMIN/Performance.js';

const AdminRouter = express.Router();

AdminRouter.use("/admin", Admins);
AdminRouter.use("/admin", AdminLogin);
AdminRouter.use("/admin", Employees);
AdminRouter.use("/admin", Departments);
AdminRouter.use("/admin", Teams);
AdminRouter.use("/admin", Leaves);
AdminRouter.use("/admin", Feedbacks);
AdminRouter.use("/admin", WorkAllocation);
AdminRouter.use("/admin", TeamWorkAllocation);
AdminRouter.use("/admin", Dashboard);
AdminRouter.use("/admin", AdminProfile);
AdminRouter.use("/admin", Performance);

export default AdminRouter;