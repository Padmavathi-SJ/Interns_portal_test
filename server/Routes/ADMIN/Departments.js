import express from "express";
import {
  fetchDepartments,
  fetchDepartmentById,
  AddDepartment,
  UpdateDepartment,
  RemoveDepartment,
  fetchEmployeesByDeptId,
  fetchEmployeeDetails
} from "../../Controllers/ADMIN/Departments.js";

const router = express.Router();

router.get("/get-departments", fetchDepartments);
router.get("/get-department/:departmentId", fetchDepartmentById);
router.post("/add-department", AddDepartment);
router.put("/edit-department/:departmentId", UpdateDepartment);
router.delete("/delete-department/:departmentId", RemoveDepartment);
router.get("/get-employees/:departmentId", fetchEmployeesByDeptId);
router.get("/get-emp-details/:employeeId", fetchEmployeeDetails);

export default router;
