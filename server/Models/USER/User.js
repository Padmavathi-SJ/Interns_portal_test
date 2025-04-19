import db from '../../DB/db.js';


export const userDetails = async(employeeId) => {
    const query = ` SELECT e.id, e.name, e.email, e.role, e.experience, d.name AS department, 
           e.salary, e.degree, e.university, e.graduation_year, e.skills, 
           e.certifications, e.mobile_no, e.address
    FROM employees e
    JOIN department d ON e.department_id = d.id
    WHERE e.id = ?`;

    return new Promise((resolve, reject) => {
        db.query(query, [employeeId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}