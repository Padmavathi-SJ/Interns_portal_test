import { get_announcements } from "../../Models/USER/Announcements.js";

export const fetch_announcements = async(req, res) => {
    const {id: employeeId} = req.user;

    try{
           const fetched = await get_announcements(employeeId);
           return res.json({ status: true, Announcements: fetched});
       } catch (error) {
         console.log("Error fetching announcements: ", error);
         return res
           .status(500)
           .json({ status: false, Error: "Database Query Error" });
       }   
}