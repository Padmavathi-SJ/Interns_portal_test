import db from '../../DB/db.js';

export const AdminLogin = async (email) => {
    const sql = "select * from admin where email = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [email], (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};