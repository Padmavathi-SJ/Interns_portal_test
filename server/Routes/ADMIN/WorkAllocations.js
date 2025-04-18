import express from 'express';
import { allocate_work, fetchPendingAllocations, fetchAllTasks } from "../../Controllers/ADMIN/WorkAllocations.js";

const router= express.Router();

router.post("/allocate_work", allocate_work);
router.get("/pending_tasks/:employee_id", fetchPendingAllocations);
router.get("/get_allTasks", fetchAllTasks);

export default router;