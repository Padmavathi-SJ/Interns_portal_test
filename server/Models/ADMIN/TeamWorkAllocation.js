import db from '../../DB/db.js';

export const Allocate_Team_Work = async(
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
) => {
    const query = `insert into team_work_allocation (
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
                    created_at) 
                    values (?,?,?,?,?,?,?,?,?,?,?) `;

                    const formatDateTimeForMySQL = (date) => {
                        const d = new Date(date);
                        const pad = (n) => (n < 10 ? '0' + n : n);
                        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
                      };

                      created_at = formatDateTimeForMySQL(created_at);

                      return new Promise((resolve, reject) => {
                        db.query(query, [team_id, title, description, date, from_time, to_time, deadline, venue, priority, status, created_at], (err, result) => {
                            if(err) return reject(err);
                            return resolve(result);
                        })
                      })
}


export const getPendingAllocationByTeam = async (team_id) => {
  const query = `SELECT * FROM team_work_allocation WHERE team_id = ?`;
 // console.log("Running query for team_id:", team_id); // log before query execution
  
  return new Promise((resolve, reject) => {
    db.query(query, [team_id], (err, result) => {
      if (err) {
       // console.log("Error executing query:", err); // log query error
        return reject(err);
      }
    //  console.log("Query result:", result); // log query result
      return resolve(result);
    });
  });
};
