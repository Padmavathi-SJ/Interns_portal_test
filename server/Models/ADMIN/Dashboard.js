import { resolve } from 'path';
import db from '../../DB/db.js';

export const totalemployees = async() => {
    const query = `select count(*) from employees`;
    return new Promise((resolve, reject) => {
        return db.query(query, (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })   
}

export const totalDepartments = async() => {
    const query = `select count(*) from department`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const totalTeams = async() => {
    const query = `select count(*) from teams`;
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}