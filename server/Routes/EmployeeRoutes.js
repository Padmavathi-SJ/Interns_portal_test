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

           // console.log("Generated Token:", token); // Log the token for debugging

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
    //  console.log("Decoded userToken:", decoded); // In backend, check employee id and role
      next();
    });
};

// Get employee details based on logged-in employee's ID from the token
router.get("/get_employee", verifyToken, (req, res) => {
  const { id: employeeId } = req.user; // Extract employeeId from the verified token

  //console.log("Fetching details for employee ID:", employeeId);

  const query = `
    SELECT e.id, e.name, d.name AS department, e.role, e.experience
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
router.get("/get_task", verifyToken, (req, res) => {
  const { id: employeeId } = req.user; // Extract employeeId from the token

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
      return res.json({ Status: false, Message: "No tasks assigned for you." });
    }

    res.json({ Status: true, Result: results });
  });
});

router.get('/get_today_tasks', verifyToken, (req, res) => {
  const { id: employeeId } = req.user; // Extract employeeId from the token

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Query to fetch tasks created today for the logged-in employee
  const query = `
    SELECT id AS taskId, title, description, deadline, priority, status, created_at
    FROM work_allocation
    WHERE employee_id = ?
    AND DATE(created_at) = ?
    ORDER BY created_at DESC;
  `;

  connection.query(query, [employeeId, today], (err, results) => {
    if (err) {
      console.error("Error fetching today's tasks:", err);
      return res.status(500).json({ Status: false, Error: "An error occurred while fetching today's tasks." });
    }

    if (results.length > 0) {
      return res.json({
        Status: true,
        Result: results
      });
    } else {
      return res.json({
        Status: false,
        Message: "No tasks found for today."
      });
    }
  });
});

// Get tasks for the logged-in employee excluding today's tasks
router.get('/get_all_tasks', verifyToken, (req, res) => {
  const { id: employeeId } = req.user; // Extract employeeId from the token

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Query to fetch tasks created except today for the logged-in employee
  const query = `
    SELECT id AS taskId, title, description, deadline, priority, status, created_at
    FROM work_allocation
    WHERE employee_id = ?
    AND DATE(created_at) != ?
    ORDER BY created_at DESC;
  `;

  connection.query(query, [employeeId, today], (err, results) => {
    if (err) {
      console.error("Error fetching tasks:", err);
      return res.status(500).json({ Status: false, Error: "An error occurred while fetching tasks." });
    }

    if (results.length > 0) {
      return res.json({
        Status: true,
        Result: results
      });
    } else {
      return res.json({
        Status: false,
        Message: "No tasks found except today's tasks."
      });
    }
  });
});


// Backend: Update task status
router.put("/update_task_status/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ Status: false, Error: "Status is required" });
  }

  const sql = `
    UPDATE work_allocation
    SET status = ?
    WHERE id = ?
  `;
  connection.query(sql, [status, taskId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.post("/apply_leave", (req, res) => {
  const { employee_id, leave_type, start_date, end_date, reason } = req.body;

  if (!employee_id || !leave_type || !start_date || !end_date || !reason) {
    return res.status(400).json({ Status: false, Error: "All fields are required." });
  }

  const sql = `
    INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, reason, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `;

  connection.query(
    sql,
    [employee_id, leave_type, start_date, end_date, reason],
    (err, result) => {
      if (err) {
        console.error("Query Error:", err);
        return res.status(500).json({ Status: false, Error: "Failed to apply leave." });
      }
      // Send back the status along with the successful response
      return res.json({ Status: true, Result: result, status: 'Pending' });
    }
  );
});

// Assuming you have a logged-in user and can get the employee_id from the session or JWT
router.get("/leave_request", verifyToken, (req, res) => {
  const { id: employeeId } = req.user; // Extract employeeId from the verified token

  // Query to fetch leave requests for the logged-in employee
  const query = "SELECT * FROM leave_requests WHERE employee_id = ?";

  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching leave requests:", err);
      return res.status(500).json({ Status: false, Error: "Error fetching leave requests" });
    }

    if (results.length === 0) {
      return res.json({ Status: false, Message: "You have not applied for any leaves yet." });
    }

    res.json({ Status: true, Result: results });
  });
});


router.post("/feedback", (req, res) => {
  const { employee_id, feedback_type, description, priority } = req.body;

  if (!employee_id || !feedback_type || !description) {
    return res.status(400).json({ success: false, error: "All fields are required." });
  }

  const sql = `
    INSERT INTO feedback (employee_id, feedback_type, description, priority, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  connection.query(
    sql,
    [employee_id, feedback_type, description, priority || "Medium"],
    (err, result) => {
      if (err) {
        console.error("Query Error:", err);
        return res.status(500).json({ success: false, error: "Failed to submit feedback." });
      }
      return res.json({ success: true, message: "Feedback submitted successfully!", status: "Pending" });
    }
  );
});


router.get("/feedback_list", verifyToken, (req, res) => {
  const { id: employeeId } = req.user;

  const query = "SELECT * FROM feedback WHERE employee_id = ?";
  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching feedbacks:", err);
      return res.status(500).json({ Status: false, Error: "Error fetching feedbacks" });
    }

    if (results.length === 0) {
      return res.json({ Status: false, Message: "No feedbacks submitted yet." });
    }

    res.json({ Status: true, Result: results });
  });
});

router.get("/about_employee", verifyToken, (req, res) => {
  const { id: employeeId } = req.user;  // Extract employeeId from the verified token
  
  const query = `
    SELECT e.id, e.name, d.name AS department, e.role, e.experience, e.mobile_no, e.email, e.salary, e.degree, 
           e.university, e.graduation_year, e.skills, e.certifications
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


  

export { router as employeeRouter };
