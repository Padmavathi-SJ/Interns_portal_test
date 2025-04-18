import { totalemployees, totalDepartments, totalTeams, taskAssignedCount, 
    taskStatusCountByDate, TeamTaskStatusCountByDate, getAverageAttendance,
    PendingLeavesCount, PendingFeedbackCount, AdminsCount} from "../../Models/ADMIN/Dashboard.js";

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

export const fetchTaskAssignedCount = async (req, res) => {
    try{
        const totalTaskAssignedCount = await taskAssignedCount();
        return res.json({status: true, TaskAssignCount: totalTaskAssignedCount});
    } catch(error){
        console.log("Error fetching task assigned  count ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetchTaskStatusCount = async(req, res) => {
    try{
        const {date} = req.query;
        const taskDate = await taskStatusCountByDate(date);
        return res.json({status: true, taskStatus: taskDate[0]});
    } catch(error){
        console.log("Error fetching task status by date ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}


export const fetchTeamTaskStatusCount = async(req, res) => {
    try{
        const {date} = req.query;
        const taskDate = await TeamTaskStatusCountByDate(date);
        return res.json({status: true, taskStatus: taskDate[0]});
    } catch(error){
        console.log("Error fetching team task status by date ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}


export const fetchAvgAttendance = async(req, res) => {
    try{
        const AvgAttendance = await getAverageAttendance();
        return res.json({status: true, Avg: AvgAttendance});
    } catch(error){
        console.log("Error calculating avg attendance ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetchPendingLeave = async(req, res) => {
    try{
        const leaveCount = await PendingLeavesCount();
        return res.json({status: true, PendingCount: leaveCount});
    } catch(error){
        console.log("Error fetching pending leave count", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetchPendingFeedback = async(req, res) => {
    try{
        const feedbackCount = await PendingFeedbackCount();
        return res.json({status: true, PendingFeedback: feedbackCount});
    } catch(error){
        console.log("Error fetching pending feedback count", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetchAdminsCount = async(req, res) => {
    try{
        const Count = await AdminsCount();
        return res.json({status: true, AdminCount: Count});
    } catch(error){
        console.log("Error fetching admins count", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}
