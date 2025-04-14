import express from 'express';
import { AddEmployee } from '../../Controllers/ADMIN/Employees.js';

const router = express.Router();

router.post("/add-employee", AddEmployee);

export default router;