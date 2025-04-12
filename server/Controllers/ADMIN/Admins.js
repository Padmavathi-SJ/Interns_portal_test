import {getAllAdmins, addAdmin} from '../../Models/ADMIN/Admins.js';
import bcrypt from 'bcrypt';

export const fetchAllAdmins = async (req, res) => {
    try {
        const admins = await getAllAdmins();
        return res.json({ status: true, Admins: admins });
    } catch (error) {
        console.log("Error fetching admins: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}


export const AddAdmin = async (req,res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ Status: false, Error: "Missing required feilds "});
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const added = await addAdmin(email, hashedPassword);
        return res.json({ Status: true, admin: added});
    } catch(err){
        console.log("Error Adding admin: ", err);
        return res.status(500).json({Status: false, Error: "Database Query Error"});
    }
}
