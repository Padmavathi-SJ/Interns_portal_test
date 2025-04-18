import express from 'express';
import { fetchTotalEmployees, fetchTotalDepartments, fetchTotalTeams, 
    fetchTaskAssignedCount, fetchTaskStatusCount, fetchTeamTaskStatusCount,
    fetchAvgAttendance, fetchPendingLeave, fetchPendingFeedback, fetchAdminsCount
     } from '../../Controllers/ADMIN/Dashboard.js';

const router = express.Router();

router.get("/total_employees", fetchTotalEmployees);
router.get("/total_departments", fetchTotalDepartments);
router.get("/total_teams", fetchTotalTeams);
router.get("/total_task_assigned_count", fetchTaskAssignedCount);
router.get("/task_status_by_date", fetchTaskStatusCount);
router.get("/teamTask_status_by_date", fetchTeamTaskStatusCount);
router.get("/avg_attendance", fetchAvgAttendance);
router.get("/pending_leaves_count", fetchPendingLeave);
router.get("/pending_feedbacks_count", fetchPendingFeedback);
router.get("/admins_count", fetchAdminsCount);

export default router;