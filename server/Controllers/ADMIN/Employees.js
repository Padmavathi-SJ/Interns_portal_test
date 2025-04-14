import { addEmployee, getEmployees, getEmployeeById, editEmployee } from "../../Models/ADMIN/Employees.js";
import bcrypt from 'bcrypt';

export const AddEmployee = async(req, res) => {
    const {
        name,
        email,
        password,
      role,
      experience,
      department_id,
      salary,
      degree,
      university,
      graduation_year,
      skills,
      certifications,
      mobile_no,
      address,
    } = req.body;

    if(!name || !email || !password || !role || !experience || !department_id || !salary || !degree || !university || 
        !graduation_year || !skills || !certifications || !mobile_no || !address) {
            return res.status(400).json({ status: false, Error: "Missing required feilds" });
        }

       const hashedPassword = await bcrypt.hash(password, 10);

            try{
            const added = await addEmployee(name, 
                email, 
                hashedPassword, 
                role, 
                experience,
                department_id,
                salary,
                degree,
                university,
                graduation_year,
                skills,
                certifications,
                mobile_no,
                address
            );
            return res.json({ Status: true, employee: added});
        } catch(err){
            console.log("Error Adding employee: ", err);
            return res.status(500).json({ Status: false, Error: "Database query error "});
        }
}


export const fetchAllEmployees = async(req, res) => {
    try {
        const employees = await getEmployees();
        return res.json({ status: true, Employees: employees});
    } catch (error) {
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetchEmployeeById = async (req, res) => {
    const {employeeId} = req.params;
    try{
        const employee = await getEmployeeById(employeeId);
        return res.json({ status: true, Employee: employee});
    } catch(error){
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const UpdateEmployee = async (req, res) => {
    const {employeeId} = req.params;
    const {name, email, password, role, experience, department_id, salary, degree, university, graduation_year, skills, certifications, mobile_no, address}=req.body;

    if(!name || !email || !password || !role || !experience || !department_id || !salary || !degree || !university || !graduation_year || !skills || !certifications || !mobile_no || !address) {
        return res.status(400).json({status: false, Error: "Missing required feilds"});
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);
        const updated = await editEmployee(
            name,
            email,
            hashedPassword,
            role,
            experience,
            department_id,
            salary,
            degree, university,
            graduation_year,
            skills,
            certifications,
            mobile_no,
            address,
            employeeId
        );
        return res.json({Status: true, employee: updated});
    } catch(error){
        console.log("Error Adding employee: ", error);
        return res.status(500).json({ Status: false, Error: "Database query error "});
    }
}