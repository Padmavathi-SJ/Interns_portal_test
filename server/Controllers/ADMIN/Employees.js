import { addEmployee } from "../../Models/ADMIN/Employees.js";
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

       const hashedPassword= bcrypt.hash(password, 10);

            /*
            const values = [
                name,
                email,
                hash,
                role,
                experience || 0,
                department_id,
                salary,
                degree,
                university,
                graduation_year,
                skills || "",
                certifications || "",
                mobile_no,
                address
            ];
            */

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
