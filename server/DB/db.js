import mysql from 'mysql';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: "padmacs253",
    database: "employee"
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