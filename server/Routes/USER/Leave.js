import express from 'express';
import verifyToken from '../../Middlewares/Auth.js';
import { fetch_leaves, apply_leave, fetch_leave_reason } from '../../Controllers/USER/Leave.js';

const router = express.Router();

router.get("/get_leave_requests", verifyToken, fetch_leaves);
router.post("/apply_leave", apply_leave);
router.get("/get_reason/:id", verifyToken, fetch_leave_reason);

export default router;
