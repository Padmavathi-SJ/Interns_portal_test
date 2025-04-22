import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`

const pool = mysql.createPool(urlDB);

  
pool.getConnection((err, connection) => {
    if(err){
        console.log("database connection error", err.message);
    }
    else {
        console.log("database connected successfully");
        connection.release();
    }
})

export default pool;