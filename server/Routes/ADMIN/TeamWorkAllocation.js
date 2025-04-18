import express from 'express';
import { allocate_work } from "../../Controllers/ADMIN/TeamWorkAllocation.js";

const router = express.Router();

router.post("/allocate_team_work", allocate_work);

export default router;