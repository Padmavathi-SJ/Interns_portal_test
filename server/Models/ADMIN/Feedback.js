import db from '../../DB/db.js';

export const get_feedbacks = async() => {
    const query = `select  * from feedback`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}


export const change_status = async(status, id) => {
    const query = `update feedback set status = ? where id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [status, id], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    }) 
}

export const write_solution = async(solution, id) => {
    const query = `update feedback set solution = ? where id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [solution, id], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}