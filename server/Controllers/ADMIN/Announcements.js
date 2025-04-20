import { addAnnouncement, get_announcements, 
          get_announcements_byId, edit_announcement,
        deleteAnnouncement } from "../../Models/ADMIN/Announcements.js";

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

  if (
    !title || !description || !extra_info || !priority ||
    !Array.isArray(target_ids) || !created_at || !category
  ) {
    return res.status(400).json({ Status: false, Message: "Invalid input" });
  }

  try {
    const added = await addAnnouncement(
      title,
      description,
      extra_info,
      priority,
      target_ids, // pass directly
      created_at,
      category
    );
    return res.json({ status: true, Result: added });
  } catch (error) {
    console.error("Error creating announcement: ", error);
    return res.status(500).json({ status: false, Error: "Database Query Error" });
  }
};


export const fetch_announcements = async(req, res) => {
  try{
    const fetched = await get_announcements();
    return res.json({ status: true, Result: fetched });
  } catch (error) {
    console.error("Error fetching announcement: ", error);
    return res.status(500).json({ status: false, Error: "Database Query Error" });
  }
}


export const fetch_announcement_byId = async(req, res) => {
  const {id} = req.params;
  try{
    const fetched = await get_announcements_byId(id);
    return res.json({ status: true, Result: fetched });
  } catch (error) {
    console.error("Error fetching announcement By Id: ", error);
    return res.status(500).json({ status: false, Error: "Database Query Error" });
  } 
}


export const update_announcement = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    extra_info,
    priority,
    target, // In frontend, it's `target`, not `target_ids`
    category
  } = req.body;

  if (
    !title || !description || !priority || !Array.isArray(target) || !category
  ) {
    return res.status(400).json({ Status: false, Message: "Invalid input" });
  }

  const created_at = new Date();

  try {
    const result = await edit_announcement(
      title,
      description,
      extra_info,
      priority,
      target,
      created_at,
      category,
      id
    );

    res.status(200).json({ Status: true, Message: "Announcement updated successfully", result });
  } catch (error) {
    res.status(500).json({ Status: false, Message: "Database error", Error: error });
  }
};


export const delete_announcement = async(req, res) => {
  const {id} = req.params;
  try{
    const deleted = await deleteAnnouncement(id);
    return res.json({ status: true, Result: deleted });
  } catch (error) {
    console.error("Error deleting announcement: ", error);
    return res.status(500).json({ status: false, Error: "Database Query Error" });
  } 
}