import { getDepartments } from "../../Models/ADMIN/Departments.js";

export const fetchDepartments = async(req, res) => {
    try{
        const departments = await getDepartments();
        return res.json({status: true, Departments: departments});
    } catch(error) {
        console.log("Error fetching departments: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}