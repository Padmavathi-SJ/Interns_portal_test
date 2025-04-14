import db from '../../DB/db.js';

export const addEmployee = async(name, email, password, role, experience, department_id, salary, degree, university, graduation_year, skills, certifications, mobile_no, address) => {
    const sql = "insert into employees (name, email, password, role, experience, department_id, salary, degree, university, graduation_year, skills, certifications, mobile_no, address) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    return new Promise((resolve, reject) => {
        db.query(sql, [name, email, password, role, experience, department_id, salary, degree, university, graduation_year, 
            skills, certifications, mobile_no, address ], (err, result) => {
                if(err) return reject(err);
                resolve(result);
            });
    });
};

export const getEmployees = async () => {
    const sql = "select employees.id AS employeeId, employees.name, department.name AS department, employees.role from employees LEFT JOIN department ON employees.department_id = department.id";
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
};