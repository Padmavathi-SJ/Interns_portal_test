import express from 'express';
import Login from './Routes/USER/Login.js';

const EmployeeRouter = express.Router();

EmployeeRouter.use("/user", Login);

export default EmployeeRouter;