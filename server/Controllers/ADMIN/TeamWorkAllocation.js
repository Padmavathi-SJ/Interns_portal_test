import { Allocate_Team_Work, getPendingAllocationByTeam, getTeamTasks } from "../../Models/ADMIN/TeamWorkAllocation.js";

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

export const fetchPendingAllocations = async (req, res) => {
    const { team_id } = req.params;
  //  console.log("team_id received in backend:", team_id); // log the team_id received
  
    try {
      const pending = await getPendingAllocationByTeam(team_id);
    //  console.log("Pending tasks fetched:", pending); // log the fetched tasks
      return res.json({ status: true, pendingTasks: pending });
    } catch (error) {
      console.log("Error fetching pending team work:", error);
      return res.status(500).json({ status: false, Error: "Database Query Error" });
    }
  };
  

  export const fetchTeamTasks = async(req, res) => {
   try{
       const fetchedTasks = await getTeamTasks();
       return res.json({status: true, TeamTasks: fetchedTasks});
     } catch(error){
         console.log("Error fetching work", error);
         return res.status(500).json({status: false, Error: "Database Query Error"});
     }
  }