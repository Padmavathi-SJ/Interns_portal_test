import express from 'express';
import { fetchDepartments, fetchDepartmentById, AddDepartment, UpdateDepartment } from "../../Controllers/ADMIN/Departments.js";

const router = express.Router();

router.get("/get-departments", fetchDepartments);
router.get("/get-department/:departmentId", fetchDepartmentById);
router.post("/add-department", AddDepartment);
router.put("/edit-department/:departmentId", UpdateDepartment);

export default router;