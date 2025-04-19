import express from 'express';
import { UserLogin } from '../../Controllers/USER/Login.js';

const router = express.Router();

router.post("/login", UserLogin);

export default router;