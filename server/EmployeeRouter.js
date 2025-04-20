import express from 'express';
import Login from './Routes/USER/Login.js';
import User from './Routes/USER/User.js';
import Works from './Routes/USER/Works.js';
import Leaves from './Routes/USER/Leave.js';
import Teams from './Routes/USER/Team.js'

const EmployeeRouter = express.Router();

EmployeeRouter.use("/user", Login);
EmployeeRouter.use("/user", User);
EmployeeRouter.use("/user", Works);
EmployeeRouter.use("/user", Leaves);
EmployeeRouter.use("/user", Teams);

export default EmployeeRouter;