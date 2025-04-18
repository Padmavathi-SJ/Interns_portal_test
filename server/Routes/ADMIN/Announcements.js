import express from 'express';
import { add_announcement } from '../../Controllers/ADMIN/Announcements.js';

const router = express.Router();

router.post("/add_announcement", add_announcement);

export default router;
