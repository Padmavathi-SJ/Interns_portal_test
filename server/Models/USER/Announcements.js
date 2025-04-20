import db from '../../DB/db.js';


export const get_announcements = async (employeeId) => {

  return new Promise((resolve, reject) => {

    const nameQuery = `select name from employees where id = ?`;

    db.query(nameQuery, [employeeId], (err, nameResult) => {
      if(err) return reject(err);
      if(nameResult === 0) return resolve([]);

      const employeeName = nameResult[0].name;

      const announcementQuery = `SELECT id, title, description, extra_info, priority, created_at
      FROM announcements
      WHERE 
        (category = 'individual' AND JSON_CONTAINS(target_ids, JSON_QUOTE(?), '$'))
        OR
        (category IN ('department', 'team') AND JSON_CONTAINS(target_ids, ?, '$'))
    `;

    db.query(announcementQuery, [employeeName, JSON.stringify(Number(employeeId))] , (err2, result) => {
      if (err) return reject(err2);
      return resolve(result);
    });
    });
  });
};

  
