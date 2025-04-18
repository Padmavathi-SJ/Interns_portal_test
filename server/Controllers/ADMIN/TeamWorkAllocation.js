import { Allocate_Team_Work} from "../../Models/ADMIN/TeamWorkAllocation.js";

export const allocate_work = async(req, res) => {
    const { 
        team_id,
        title,
        description,
        date,
        from_time,
        to_time,
        deadline,
        venue,
        priority,
        status,
        created_at
    } = req.body;

    if(!team_id || !title || !description || !date || 
        !from_time || !to_time || !deadline || !venue || !priority || !status || !created_at) {
            return res.status(400).json({Status: false, Error: "Missing required feilds"});
        }

    try{
        const allocated = await Allocate_Team_Work(
        team_id,
        title,
        description,
        date,
        from_time,
        to_time,
        deadline,
        venue,
        priority,
        status,
        created_at
        ); 
        return res.json({status: true, workAssigned: allocated});
    } catch(error){
        console.log("Error allocating team work ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
}