import express from 'express';
import { allocate_work, fetchPendingAllocations } from "../../Controllers/ADMIN/TeamWorkAllocation.js";

const router = express.Router();

router.post("/allocate_team_work", allocate_work);
router.get("/pending_team_tasks/:team_id", fetchPendingAllocations);

export default router;