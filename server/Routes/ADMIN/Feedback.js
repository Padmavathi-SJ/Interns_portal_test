import express from 'express';
import { fetch_feedbacks, update_status } from "../../Controllers/ADMIN/Feedback.js";

const router = express.Router();

router.get("/get_feedbacks", fetch_feedbacks);
router.put("/update_status/:id", update_status);

export default router;
