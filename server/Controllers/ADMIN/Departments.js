import {
  getDepartments,
  getDepartmentById,
  addDepartment,
  editDepartment,
  deleteDepartment,
  getEmployeesByDeptId,
} from "../../Models/ADMIN/Departments.js";

export const fetchDepartments = async (req, res) => {
  try {
    const departments = await getDepartments();
    return res.json({ status: true, Departments: departments });
  } catch (error) {
    console.log("Error fetching departments: ", error);
    return res
      .status(500)
      .json({ status: false, Error: "Database Query Error" });
  }
};

export const fetchDepartmentById = async (req, res) => {
  const { departmentId } = req.params;

  try {
    const getDepartment = await getDepartmentById(departmentId);
    return res.json({ status: true, Department: getDepartment });
  } catch (error) {
    console.log("Error fetching departments: ", error);
    return res
      .status(500)
      .json({ status: false, Error: "Database Query Error" });
  }
};

export const AddDepartment = async (req, res) => {
  const { department } = req.body;
  try {
    const added = await addDepartment(department);
    return res.json({ status: true, Department: added });
  } catch (error) {
    console.log("Error updating departments: ", error);
    return res
      .status(500)
      .json({ status: false, Error: "Database Query Error" });
  }
};

export const UpdateDepartment = async (req, res) => {
  const { departmentId } = req.params;
  const { name } = req.body;
  try {
    const updated = await editDepartment(name, departmentId);
    return res.json({ status: true, Department: updated });
  } catch (error) {
    console.log("Error updating departments: ", error);
    return res
      .status(500)
      .json({ status: false, Error: "Database Query Error" });
  }
};

export const RemoveDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const removed = await deleteDepartment(departmentId);
    return res.json({ status: true, Department: removed });
  } catch (error) {
    console.log("Error deleting departments: ", error);
    return res
      .status(500)
      .json({ status: false, Error: "Database Query Error" });
  }
};

export const fetchEmployeesByDeptId = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const fetchedEmployees = await getEmployeesByDeptId(departmentId);
    return res.json({ status: true, Employees: fetchedEmployees });
  } catch (error) {
    console.log("Error Fetching Employees: ", error);
    return res
      .status(500)
      .json({ status: false, Error: "Database Query Error" });
  }
};
