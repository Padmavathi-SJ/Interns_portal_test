import express from 'express';
import { AddEmployee, fetchAllEmployees, fetchEmployeeById, UpdateEmployee } from '../../Controllers/ADMIN/Employees.js';

const router = express.Router();

router.post("/add-employee", AddEmployee);
router.get("/get-employees", fetchAllEmployees);
router.get("/get-employee/:employeeId", fetchEmployeeById);
router.put("/update-employee/:employeeId", UpdateEmployee);

export default router;