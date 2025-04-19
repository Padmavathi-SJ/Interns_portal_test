import express from 'express';
import  verifyToken  from '../../Middlewares/Auth.js';
import { get_user_details } from '../../Controllers/USER/User.js';

const router = express.Router();

router.get("/user_details", verifyToken, get_user_details);

export default router;

