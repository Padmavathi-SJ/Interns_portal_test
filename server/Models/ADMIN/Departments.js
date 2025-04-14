import { resolve } from 'path';
import db from '../../DB/db.js';
import { rejects } from 'assert';

export const getDepartments = async() => {
    const query = "select * from department";
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};

export const getDepartmentById = async(departmentId) => {
    const query = "select * from department where id = ?";
    return new Promise((resolve, reject) => {
        db.query(query, [departmentId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const editDepartment = async (name, departmentId) => {
    const query = `update department set name = ? where id= ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [name, departmentId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const addDepartment = async(department) => {
    const  query = `insert into department (name) values (?)`;
    return new Promise((resolve, reject) => {
        db.query(query, [department], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const deleteDepartment = async(departmentId) => {
    const query = `delete from department where id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [departmentId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const getEmployeesByDeptId = async(departmentId) => {
    const query = `select * from employees where department_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [departmentId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}