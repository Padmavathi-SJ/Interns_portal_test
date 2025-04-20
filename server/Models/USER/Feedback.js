import db from '../../DB/db.js';

export const feedback = async(employee_id, feedback_type, description, priority) => {
    const query = `insert into feedback (employee_id, feedback_type, description, priority, status) 
                    values (?,?,?,?,'Pending')`;
        return new Promise((resolve, reject) => {
            db.query(query, [employee_id, feedback_type, description, priority], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
}

export const get_feedbacks = async(employeeId) => {
    const query = `select * from feedback where employee_id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [employeeId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}