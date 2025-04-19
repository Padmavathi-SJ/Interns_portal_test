import express from 'express';
import Login from './Routes/USER/Login.js';
import User from './Routes/USER/User.js';

const EmployeeRouter = express.Router();

EmployeeRouter.use("/user", Login);
EmployeeRouter.use("/user", User);

export default EmployeeRouter;