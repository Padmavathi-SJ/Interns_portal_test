import { resolve } from 'path';
import db from '../../DB/db.js';
import { rejects } from 'assert';

export const getDepartments = async() => {
    const sql = "select * from department";
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};

export const getDepartmentById = async(departmentId) => {
    const sql = "select * from department where id = ?";
    return new Promise((resolve, reject) => {
        db.query(sql, [departmentId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const editDepartment = async (name, departmentId) => {
    const sql = `update department set name = ? where id= ? `;
    return new Promise((resolve, reject) => {
        db.query(sql, [name, departmentId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const addDepartment = async(department) => {
    const sql = `insert into department (name) values (?)`;
    return new Promise((resolve, reject) => {
        db.query(sql, [department], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}