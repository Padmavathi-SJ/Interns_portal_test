import express from 'express';
import { CreateTeam, fetch_teams, update_team, fetch_team_details, remove_team } from "../../Controllers/ADMIN/Teams.js";

const router = express.Router();

router.post("/create-team", CreateTeam);
router.get("/get-teams", fetch_teams);
router.put("/edit-team", update_team);
router.get("/get_team_details/:teamId", fetch_team_details);
router.delete("/remove_team/:teamId", remove_team);

export default router;
