import { addAnnouncement } from "../../Models/ADMIN/Announcements.js";

export const add_announcement = async (req, res) => {
  const {
    title,
    description,
    extra_info,
    priority,
    target_ids,
    created_at,
    category,
  } = req.body;

  if(!title || !description || !extra_info || !priority || !Array.isArray(target_ids) || !created_at || !category){
    return res.status(400).json({Status: false, Message: "Invalid input"});
  }
  try{
    const members = JSON.stringify(target_ids);
    const added = await addAnnouncement(
        title,
        description,
        extra_info,
        priority,
        members,
        created_at,
        category
    );
    return res.json({status: true, Result: added});
} catch(error){
    console.log("Error creating announcement: ", error);
    return res.status(500).json({status: false, Error: "Database Query Error"});
}

};
