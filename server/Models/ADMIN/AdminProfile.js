import db from '../../DB/db.js';

export const profile = async(email) => {
    const query = `select email from admin where email = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [email], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

