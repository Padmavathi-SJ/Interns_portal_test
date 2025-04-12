import express from 'express';
import {fetchAllAdmins, AddAdmin} from '../../Controllers/ADMIN/Admins.js';


const router = express.Router();

router.get("/get-admins", fetchAllAdmins);
router.post("/add-admin", AddAdmin);


export default router;