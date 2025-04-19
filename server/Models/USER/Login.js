import db from '../../DB/db.js';

export const login = async(employee_id, email) => {
    const query = `select * from employees where id = ? and email = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [employee_id, email], (err, result) => {
            if(err) return reject(err);
            if(result.length === 0){
                return reject({message: "Employee not found"});
            }
            return resolve(result[0]);
        })
    })
}