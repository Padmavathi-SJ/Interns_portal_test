import express from 'express';
import {fetchAllAdmins} from '../../Controllers/ADMIN/Admins.js';


const router = express.Router();

router.get("/get-admins", fetchAllAdmins);


export default router;