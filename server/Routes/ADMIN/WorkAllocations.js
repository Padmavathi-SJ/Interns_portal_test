import express from 'express';
import { allocate_work } from "../../Controllers/ADMIN/WorkAllocations.js";

const router= express.Router();

router.post("/allocate_work", allocate_work);

export default router;