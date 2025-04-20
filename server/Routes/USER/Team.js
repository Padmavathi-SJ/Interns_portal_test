import express from 'express';
import verifyToken from '../../Middlewares/Auth.js';
import { fetch_teams, fetch_team_tasks, update_team_taskStatus } from '../../Controllers/USER/Team.js';

const router = express.Router();

router.get("/get_teams", verifyToken, fetch_teams);
router.get("/get_team_tasks/:teamId", verifyToken, fetch_team_tasks);
router.put("/update_teamTask_status/:teamId/:taskId", verifyToken, update_team_taskStatus);

export default router;