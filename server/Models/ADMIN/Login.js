import db from '../../DB/db.js';

export const AdminLogin = async (get_employee_details) => {
    const sql = "select * from admin where email = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [email], (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};