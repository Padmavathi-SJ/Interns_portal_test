import { get_leaves, leave_request, get_leave_reason } from "../../Models/USER/Leave.js";

export const fetch_leaves = async(req, res) => {
    const {id: employeeId} = req.user;
    try{
        const fetched = await get_leaves(employeeId);
        return res.json({ status: true, Leaves: fetched});
    } catch (error) {
      console.log("Error fetching leave requests: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }
}

export const apply_leave = async(req, res) => {
    const {employee_id, leave_type, from_date, to_date, from_time, to_time, Reason} = req.body;
    
    if(!employee_id || !leave_type || !from_date || !to_date || !from_time || !to_time || !Reason){
        return res.status(400).json({Status: false, Error: "All feilds are required"});
    }

    try{
        const applied = await leave_request(employee_id, leave_type, from_date, to_date, from_time, to_time, Reason);
        return res.json({ status: true, LeaveApplied: applied});
    } catch (error) {
      console.log("Error applying leave: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }
}


export const fetch_leave_reason = async(req, res) => {
    const {id} = req.params;
    try{
        const fetched = await get_leave_reason(id);
        return res.json({ status: true, LeaveReason: fetched});
    } catch (error) {
      console.log("Error fetching leave reason: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }
}