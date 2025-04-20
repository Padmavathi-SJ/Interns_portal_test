import express from 'express';
import verifyToken from '../../Middlewares/Auth.js';
import { fetch_announcements } from '../../Controllers/USER/Announcements.js';

const router = express.Router();

router.get("/get_announcements", verifyToken, fetch_announcements);

export default router;