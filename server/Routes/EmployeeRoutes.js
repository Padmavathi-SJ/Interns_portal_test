import express from "express";
import connection from "../DB/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; 
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_KEY; // Ensure this is the same key

router.post("/user_login", (req, res) => {
    const { employee_id, email, password } = req.body;

    if (!employee_id || !email || !password) {
        return res.status(400).json({ Status: false, Error: "All fields are required." });
    }

    const sql = "SELECT * FROM employees WHERE id = ? AND email = ?";
    connection.query(sql, [employee_id, email], async (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ Status: false, Error: "Internal server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ Status: false, Error: "Employee not found." });
        }

        const employee = results[0];

        try {
            const isPasswordValid = await bcrypt.compare(password, employee.password);
            if (!isPasswordValid) {
                return res.status(401).json({ Status: false, Error: "Invalid credentials." });
            }

            const token = jwt.sign(
                { id: employee.id, role: employee.role },
                JWT_SECRET, // Ensure this key matches the one used for admin login
                { expiresIn: "3h" }
            );

            console.log("Generated Token:", token); // Log the token for debugging

            res.json({
                Status: true,
                Message: "Login successful.",
                token,
            });
        } catch (err) {
            console.error("Password verification error:", err);
            res.status(500).json({ Status: false, Error: "Internal server error." });
        }
    });
});

// Middleware to verify JWT Token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Token not provided, Unauthorized' });
    }
  
   // console.log("Received Token:", token);
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
      //  console.error("Token verification failed:", err);
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
  
      req.user = decoded; // Attach user data to request object
      console.log("Decoded userToken:", decoded); // In backend, check employee id and role
      next();
    });
};

// Get employee details based on logged-in employee's ID from the token
router.get("/get_employee", verifyToken, (req, res) => {
  const { id: employeeId } = req.user; // Extract employeeId from the verified token

  //console.log("Fetching details for employee ID:", employeeId);

  const query = `
    SELECT e.id, e.name, d.name AS department, e.role, e.experience, e.salary
    FROM employees e
    JOIN department d ON e.department_id = d.id
    WHERE e.id = ?;
  `;

  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching employee details:", err);
      return res.status(500).json({ Status: false, Error: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ Status: false, Message: "Employee not found." });
    }

    res.json({ Status: true, Data: results[0] });
  });
});

// Get tasks assigned to the logged-in employee
router.get("/get_tasks", verifyToken, (req, res) => {
    const { id: employeeId } = req.user; // Extract employeeId from the token
    console.log("Fetching tasks for employee ID:", employeeId); // Debug log
  
    const query = `
      SELECT id AS taskId, title, description, deadline, priority, status
      FROM work_allocation
      WHERE employee_id = ?;
    `;
  
    connection.query(query, [employeeId], (err, results) => {
      if (err) {
        console.error("Error fetching tasks:", err);
        return res.status(500).json({ Status: false, Error: "Internal server error." });
      }
  
      if (results.length === 0) {
        console.warn("No tasks found for employee ID:", employeeId); // Debug log
        return res.status(404).json({ Status: false, Message: "No tasks found." });
      }
  
      console.log("Tasks fetched:", results); // Debug log to verify the query results
      res.json({ Status: true, Results: results }); // Ensure this is being sent back properly
    });
  });
  
  

export { router as employeeRouter };
