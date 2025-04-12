import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
})

connection.connect(function(err) {
    if(err){
        console.log("database connection error");
    }
    else {
        console.log("database connected successfully");
    }
})

export default connection;