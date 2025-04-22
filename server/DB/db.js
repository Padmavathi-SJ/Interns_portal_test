import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const urlDB = `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = mysql.createPool(urlDB);

pool.getConnection((err, connection) => {
    if (err) {
        console.log("database connection error", err.message);
    } else {
        console.log("database connected successfully");
        connection.release();
    }
});

export default pool;
