import db from '../../DB/db.js';

export const getAllAdmins = async() => {
    const sql = "select * from admin";
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};

