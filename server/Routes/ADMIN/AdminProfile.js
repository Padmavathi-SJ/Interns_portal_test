import express from 'express';
import { AdminProfile } from "../../Controllers/ADMIN/AdminProfile.js";

const router = express.Router();

router.use("/profile", AdminProfile);

export default router;

