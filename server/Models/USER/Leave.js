import db from '../../DB/db.js';

export const get_leaves = async(employeeId) => {
    const query = `select * from leave_requests where employee_id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [employeeId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const leave_request = async(employee_id, leave_type, from_date, to_date, from_time, to_time, Reason) => {
    const query = `insert into leave_requests (employee_id, leave_type, from_date, to_date, from_time, to_time, Reason, status)
                   values (?,?,?,?,?,?,?, 'Pending')`;

    return new Promise((resolve, reject) => {
        db.query(query, [employee_id, leave_type, from_date, to_date, from_time, to_time, Reason], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    }) 
}

export const get_leave_reason = async(id) => {
    const query = `select Reason from leave_requests where id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}