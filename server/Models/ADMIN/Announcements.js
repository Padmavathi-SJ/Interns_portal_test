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
    created_at,
    category
  ) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        title,
        description,
        extra_info,
        priority,
        JSON.stringify(target_ids), // Convert to valid JSON string
        created_at,
        category,
      ],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};

export const get_announcements = async () => {
  const query = `select id, category, target_ids, title, description, extra_info, priority, created_at
                  from announcements
                  order by created_at desc
                  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const get_announcements_byId = async (id) => {
  const query = `select * from announcements where id = ? `;
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};


export const edit_announcement = async (title,
  description,
  extra_info,
  priority,
  target_ids,
  created_at,
  category,
   id) => {
  const query = `update announcements 
                  set title = ?,
    description = ?,
    extra_info = ?,
    priority = ?,
    target_ids = ?,
    created_at = ?,
    category = ?
                  where id = ?
                  `;

  return new Promise((resolve, reject) => {
    db.query(
      query,
      [
        title,
        description,
        extra_info,
        priority,
        JSON.stringify(target_ids),
        created_at,
        category,
        id
      ],
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
  });
};


export const deleteAnnouncement = async(id) => {
  const query = `delete from announcements where id = ?`;
  
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, result) => {
      if(err) return reject(err);
      return resolve(result);
    })
  })
}