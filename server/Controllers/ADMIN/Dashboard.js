import { totalemployees, totalDepartments, totalTeams } from "../../Models/ADMIN/Dashboard.js";

export const fetchTotalEmployees = async (req, res) => {
    try{
        const totalEmpCount = await totalemployees();
        return res.json({status: true, TotalEmployees: totalEmpCount});
    } catch(error){
        console.log("Error fetching employees total count ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetchTotalDepartments = async (req, res) => {
    try{
        const totalDeptCount = await totalDepartments();
        return res.json({status: true, TotalDepartments: totalDeptCount});
    } catch(error){
        console.log("Error fetching departments total count ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetchTotalTeams = async (req, res) => {
    try{
        const totalTeamCount = await totalTeams();
        return res.json({status: true, TotalTeams: totalTeamCount});
    } catch(error){
        console.log("Error fetching team total  count ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}