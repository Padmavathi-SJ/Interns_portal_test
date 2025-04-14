import express from 'express';
import { AddEmployee, fetchAllEmployees } from '../../Controllers/ADMIN/Employees.js';

const router = express.Router();

router.post("/add-employee", AddEmployee);
router.get("/get-employees", fetchAllEmployees);

export default router;