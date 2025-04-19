import db from '../../DB/db.js';

export const get_tasks = async(employeeId) => {
    const query = `select id as taskId,
                    title,
                    description,
                    date,
                    from_time,
                    to_time,
                    venue,
                    deadline,
                    priority,
                    status
                    from work_allocation 
                    where employee_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [employeeId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })       
}

export const get_todays_tasks = async (employeeId, today) => {
    const query = `SELECT 
                      id AS taskId,
                      title,
                      description,
                      date,
                      from_time,
                      to_time,
                      venue,
                      deadline,
                      priority,
                      status
                   FROM work_allocation 
                   WHERE employee_id = ? AND date = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, [employeeId, today], (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
};
