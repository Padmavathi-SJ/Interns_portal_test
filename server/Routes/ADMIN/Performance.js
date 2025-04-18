import express from "express";
import { fetchPerformanceByMonth } from "../../Controllers/ADMIN/Performance.js";

const router = express.Router();

router.get("/get_monthly_performance", fetchPerformanceByMonth);

export default router;
