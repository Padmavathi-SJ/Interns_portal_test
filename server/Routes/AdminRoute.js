import express from "express";
import connection from "../DB/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import multer from "multer";
import path from "path";

const router = express.Router();

router.post("/adminLogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ? AND password = ?";
  connection.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

router.get("/get_departments", (req, res) => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});

router.post("/add_department", (req, res) => {
  const checkSql = "SELECT * FROM department WHERE name = ?";
  connection.query(checkSql, [req.body.department], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });

    if (result.length > 0) {
      // Department already exists
      return res.json({ Status: false, Error: "Department already exists" });
    }

    const insertSql = "INSERT INTO department (name) VALUES (?)";
    connection.query(insertSql, [req.body.department], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true });
    });
  });
});

//profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Fixed typo here
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage
});

router.post("/add_employee", upload.single('profile_picture'), (req, res) => {
  console.log(req.body);
  console.log(req.file);

  const sql =
    `INSERT INTO employees (name, email, password, education, experience, department_id, salary, profile_picture) VALUES (?,?,?,?,?,?,?,?)`;
  
  bcrypt.hash(req.body.password.toString(), 10,  (err, hash) => {
    if (err) return res.json({ Status: false, Error: "Query Error" })
    const values = [
      req.body.name,
      req.body.email,
      hash,
      req.body.education,
      req.body.experience,
      req.body.department_id,
      req.body.salary,
      req.file ? req.file.path : null
    ]

    connection.query(sql, values, (err, result) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      return res.json({ Status: true, Result: result });
    })
  })
});


export { router as adminRouter };
