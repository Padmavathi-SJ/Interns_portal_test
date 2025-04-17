import db from '../../DB/db.js';

export const get_leave_requests = async() => {
    const query = `select 
                   id,
                   employee_id,
                   leave_type,
                   DATE_FORMAT(from_date, '%d %b %Y') as from_date,
                   DATE_FORMAT(to_date, '%d %b %Y') as to_date,
                   DATE_FORMAT(from_time, '%h:%i:%s %p') as from_time,
                   DATE_FORMAT(to_time, '%h:%i:%s %p') as to_time,
                   status,
                   Reason,
                   created_at,
                   updated_at
                   from leave_requests
                   `;

        return new Promise((resolve, reject) => {
            db.query(query, (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
}


export const get_leave_reason = async(leaveRequestId) => {
    const query = `select Reason from leave_requests where id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [leaveRequestId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const update_leave = async(status, id) => {
    const query = `update leave_requests set status = ? where id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [status, id], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}