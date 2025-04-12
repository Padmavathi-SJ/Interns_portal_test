import express from 'express';
import {Login} from '../../Controllers/ADMIN/AdminLogin.js';

const router = express.Router();

router.post("/adminLogin", Login);

export default router;