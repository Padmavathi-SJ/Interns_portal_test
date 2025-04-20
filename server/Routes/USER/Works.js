import express from 'express';
import verifyToken from '../../Middlewares/Auth.js';
import {fetch_all_tasks, fetch_todays_tasks, update_task_status} from '../../Controllers/USER/Works.js';

const router = express.Router();

router.get("/get_all_tasks", verifyToken, fetch_all_tasks);
router.get("/get_todays_tasks", verifyToken, fetch_todays_tasks);
router.put("/update_task_status/:taskId", verifyToken, update_task_status);

export default router;