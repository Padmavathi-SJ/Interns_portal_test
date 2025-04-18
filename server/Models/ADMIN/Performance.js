import db from '../../DB/db.js';

export const PerformanceByMonth = async (month) => {
    const query = `
      SELECT 
        e.id AS employee_id,
        e.name AS employee_name,
        COUNT(wa.id) AS total_tasks,
        SUM(wa.status = 'Completed') AS completed_tasks,
        CASE
          WHEN SUM(wa.status = 'Completed') / COUNT(wa.id) >= 0.8 THEN 'Good'
          WHEN SUM(wa.status = 'Completed') / COUNT(wa.id) >= 0.5 THEN 'Moderate'
          ELSE 'Needs Improvement'
        END AS performance
      FROM work_allocation wa
      JOIN employees e ON e.id = wa.employee_id
      WHERE DATE_FORMAT(wa.date, '%Y-%m') = ?
      GROUP BY e.id
  
      UNION ALL
  
      SELECT 
        jt.employee_id,
        e.name AS employee_name,
        COUNT(twa.id) AS total_tasks,
        SUM(twa.status = 'Completed') AS completed_tasks,
        CASE
          WHEN SUM(twa.status = 'Completed') / COUNT(twa.id) >= 0.8 THEN 'Good'
          WHEN SUM(twa.status = 'Completed') / COUNT(twa.id) >= 0.5 THEN 'Moderate'
          ELSE 'Needs Improvement'
        END AS performance
      FROM team_work_allocation twa
      JOIN teams t ON t.team_id = twa.team_id
      JOIN JSON_TABLE(
          t.team_members, 
          '$[*]' COLUMNS (
            employee_id INT PATH '$'
          )
        ) AS jt
      JOIN employees e ON e.id = jt.employee_id
      WHERE DATE_FORMAT(twa.date, '%Y-%m') = ?
      GROUP BY jt.employee_id
    `;
  
    return new Promise((resolve, reject) => {
      db.query(query, [month, month], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  