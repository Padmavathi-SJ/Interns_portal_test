import express from 'express';
import { add_announcement, fetch_announcements, 
        fetch_announcement_byId, update_announcement,
    delete_announcement } from '../../Controllers/ADMIN/Announcements.js';

const router = express.Router();

router.post("/add_announcement", add_announcement);
router.get("/get_announcements", fetch_announcements);
router.get("/get_announcementById/:id", fetch_announcement_byId);
router.put("/update_announcement/:id", update_announcement);
router.delete("/delete_announcement/:id", delete_announcement);

export default router;
