import { get_leave_requests, get_leave_reason, update_leave } from "../../Models/ADMIN/Leave.js";

export const fetch_leaves_requests = async(req, res) => {
    try{
        const fetchedRequests = await get_leave_requests();
        return res.json({status: true, LeaveRequests: fetchedRequests});
    } catch(error){
        console.log("Error fetching Leave requests: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const fetch_leave_reason = async(req, res) => {
    const leaveRequestId = req.params.id;
    try{
        const fetchedReason = await get_leave_reason(leaveRequestId);
        return res.json({status: true, LeaveReason: fetchedReason});
    } catch(error){
        console.log("Error fetching Leave reason: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const update_leave_request = async(req, res) => {
    const {id} = req.params;
    const {status} = req.body;

    if(status !== "approved" && status !== "rejected"){
        return res.status(400).json({ Status: false, Error: "Invalid status" });
    }

    try{
        const updated = await update_leave(status, id);
        return res.json({status: true, UpdatedLeave: updated});
    } catch(error){
        console.log("Error updating Leave request: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}
