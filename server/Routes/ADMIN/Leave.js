import express from 'express';
import { fetch_leaves_requests, fetch_leave_reason } from '../../Controllers/ADMIN/Leave.js';

const router = express.Router();

router.get("/get_leave_requests", fetch_leaves_requests);
router.get("/get_leave_reason/:id", fetch_leave_reason);

export default router;