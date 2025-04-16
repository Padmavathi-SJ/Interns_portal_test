import { get_feedbacks, change_status } from "../../Models/ADMIN/Feedback.js";

export const fetch_feedbacks = async(req, res) => {
    try{
        const fetched = await get_feedbacks();
        return res.json({status: true, Feedbacks: fetched});
    } catch(error){
        console.log("Error fetching Feedbacks: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}

export const update_status = async(req, res) => {
    const {id} = req.params;
    const {status} = req.body;
    if(!status !== "approved" && !status !== "rejected"){
        return res.status(400).json({ Status: false, Error: "Invalid status"});
    }
    
    try{
        const updated = await change_status(status, id);
        return res.json({status: true, feedbackStatus: updated});
    } catch(error){
        console.log("Error updating status: ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
} 