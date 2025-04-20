import express from 'express';
import verifyToken from '../../Middlewares/Auth.js';
import { post_feedback, fetch_feedbacks } from '../../Controllers/USER/Feedback.js';

const router = express.Router();

router.post("/push_feedback", verifyToken, post_feedback);
router.get("/get_feedbacks", verifyToken, fetch_feedbacks);

export default router;
