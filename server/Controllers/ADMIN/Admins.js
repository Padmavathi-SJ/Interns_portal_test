import {getAllAdmins} from '../../Models/ADMIN/Admins.js';

export const fetchAllAdmins = async (req, res) => {
    try {
        const admins = await getAllAdmins();
        return res.json({ status: true, Admins: admins });
    } catch (error) {
        console.log("Error fetching admins: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

