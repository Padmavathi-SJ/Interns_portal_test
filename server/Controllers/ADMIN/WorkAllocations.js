import { AllocateWork } from "../../Models/ADMIN/WorkAllocations.js";

export const allocate_work = async (req, res) => {
  const {
    employee_id,
    department_name,
    title,
    description,
    date,
    from_time,
    to_time,
    venue,
    deadline,
    priority,
    created_at,
    status,
  } = req.body;

  if(!employee_id || !department_name || !title || !description || !date || !from_time || !to_time ||
    !venue || !deadline || !priority || !created_at || !status) {
        return res.status(400).json({Status: false, Error: "Missing required feilds"});
    }

    try{
        const allocated = await AllocateWork(
            employee_id,
            department_name,
            title,
            description,
            date,
            from_time,
            to_time,
            venue,
            deadline,
            priority,
            created_at,
            status);
            return res.json({status: true, workAssigned: allocated});
    } catch(error){
        console.log("Error allocating work ", error);
        return res.status(500).json({status: false, Error: "Database Query Error"});
    }
    
};
