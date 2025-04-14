import express from 'express';
import { fetchDepartments } from "../../Controllers/ADMIN/Departments.js";

const router = express.Router();

router.get("/get-departments", fetchDepartments);

export default router;