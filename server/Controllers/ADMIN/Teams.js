import { createTeam, get_teams, edit_team, get_team, delete_team } from "../../Models/ADMIN/Teams.js";

export const CreateTeam = async(req, res) => {
    const {team_name, team_members} = req.body;
    if(!team_name || !Array.isArray(team_members) || team_members.length === 0){
        return res.status(400).json({Status: false, Message: "Invalid input"});
    }

    try{
        const teamMembersJson = JSON.stringify(team_members);
        const TeamCreated = await createTeam(team_name, teamMembersJson);
        return res.json({status: true, Team: TeamCreated});
    } catch(error){
        console.log("Error creating Team: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetch_teams = async(req, res) => {
    try{
        const fetchedTeams = await get_teams();
        return res.json({status: true, Teams: fetchedTeams});
    } catch(error){
        console.log("Error fetching Teams: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const update_team = async(req, res) => {
    const {teamId} = req.params;
    const {team_name, team_members} = req.body;

    if(!team_name || !team_members){
        return res.status(400).json({Status: false, Error: "Missing required fields"});
    }

    try{
        const teamMembers = JSON.stringify(team_members);
        const updated = await edit_team(teamId, team_name, teamMembers);
        return res.json({status: true, UpdatedTeams: updated});
    } catch(error){
        console.log("Error fetching Teams: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}


export const fetch_team_details = async(req, res) => {
    const {teamId} = req.params;
    try{
        const getTeam = await get_team(teamId);
        if(getTeam.length > 0){
            const team = getTeam[0];
        return res.json({status: true, Team: {name: team.team_name, members: JSON.parse(team.team_members)}
        });
    }
} catch(error){
        console.log("Error fetching Teams: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const remove_team = async(req, res) => {
    const {teamId} = req.params;
    if(!teamId){
        return res.status(400).json({Status: false, Error: "Team ID is rewuired "});
    }
    try{
        const removed = await delete_team(teamId);
      
        return res.json({status: true, Team: removed});
    } catch(error){
        console.log("Error fetching Teams: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}
