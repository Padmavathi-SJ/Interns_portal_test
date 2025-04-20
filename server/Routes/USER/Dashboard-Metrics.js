import express from 'express';
import verifyToken from '../../Middlewares/Auth.js';
import { fetch_employee, fetch_teamCount, leave_summary } from '../../Controllers/USER/Dashboard-Metrics.js';


const router = express.Router();

router.get("/about_employee", verifyToken, fetch_employee);
router.get("/team_count", verifyToken, fetch_teamCount);
router.get("/leave_summary", verifyToken, leave_summary);

export default router;