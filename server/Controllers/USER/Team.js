import { get_teams, get_team_tasks, update_team_tasks } from "../../Models/USER/Team.js";

export const fetch_teams = async(req, res) => {
    const {id: employeeId} = req.user;
    try{
        const fetched = await get_teams(employeeId);
        return res.json({ status: true, Teams: fetched});
    } catch (error) {
      console.log("Error fetching teams: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }
}


export const fetch_team_tasks = async(req, res) => {
    const {teamId} = req.params;

    try{
        const fetched = await get_team_tasks(teamId);
        return res.json({ status: true, TeamTasks: fetched});
    } catch (error) {
      console.log("Error fetching team tasks: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }   
}

export const update_team_taskStatus = async(req, res) => {
    const {teamId, taskId} = req.params;
    const {status} = req.body;

    if(!status || !['Pending', 'In Progress', 'Completed'].includes(status)) {
        return res.status(400).json({Status: false, Error: "Invalid or missing status"});
    }

    try{
        const updated = await update_team_tasks(status, teamId, taskId);
        return res.json({ status: true, taskUpdated: updated});
    } catch (error) {
      console.log("Error updating task status: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }   
}