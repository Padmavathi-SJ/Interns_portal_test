import express from 'express';
import Admins from './Routes/ADMIN/Admins.js';

const AdminRouter = express.Router();

AdminRouter.use("/admin", Admins);

export default AdminRouter;