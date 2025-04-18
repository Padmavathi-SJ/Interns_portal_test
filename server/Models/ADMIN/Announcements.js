import db from "../../DB/db.js";

export const addAnnouncement = async (
  title,
  description,
  extra_info,
  priority,
  target_ids,
  created_at,
  category
) => {
    const query = `INSERT INTO announcements (
        title,
        description,
        extra_info,
        priority,
        target_ids,
        category
      ) VALUES (?,?,?,?,?, ?)`;
      return new Promise((resolve, reject) => {
        const teamMembers = JSON.stringify(target_ids);
      db.query(
        query,
        [title, description, extra_info, priority, teamMembers, category], // No created_at
        (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        }
      );
    });
    }      