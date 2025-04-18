import express from 'express';
import { fetchTotalEmployees, fetchTotalDepartments, fetchTotalTeams } from '../../Controllers/ADMIN/Dashboard.js';

const router = express.Router();

router.get("/total_employees", fetchTotalEmployees);
router.get("/total_departments", fetchTotalDepartments);
router.get("/total_teams", fetchTotalTeams);

export default router;