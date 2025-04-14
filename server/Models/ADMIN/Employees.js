import db from '../../DB/db.js';

export const addEmployee = async(name, email, password, role, experience, department_id, salary, degeree, university, graduation_year, skills, certifications, mobile_no, address) => {
    const sql = "insert into employees (name, email, password, role, experience, department_id, salary, degeree, university, graduation_year, skills, certifications, mobile_no, address) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    return new Promise((resolve, reject) => {
        db.query(sql, [name, email, password, role, experience, department_id, salary, degeree, university, graduation_year, 
            skills, certifications, mobile_no, address ], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
    });
};
