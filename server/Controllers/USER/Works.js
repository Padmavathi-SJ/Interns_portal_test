import { get_tasks, get_todays_tasks } from "../../Models/USER/Works.js";

export const fetch_all_tasks = async(req, res) => {
    const {id: employeeId} = req.user;

    try{
        const fetched = await get_tasks(employeeId);
        return res.json({ status: true, AllTasks: fetched});
    } catch (error) {
      console.log("Error fetching all tasks: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }
}

export const fetch_todays_tasks = async(req, res) => {
    const {id: employeeId} = req.user;

    const today = new Date().toISOString().split('T')[0]; // '2025-04-19' // Pass as string
    

    try{
        const fetched = await get_todays_tasks(employeeId, today);
        return res.json({ status: true, TodaysTasks: fetched});
    } catch (error) {
      console.log("Error fetching todays tasks: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }

}