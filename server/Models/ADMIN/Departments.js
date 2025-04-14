import db from '../../DB/db.js';

export const getDepartments = async() => {
    const sql = "select * from department";
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};