import express from "express";
import connection from "../DB/db.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

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

router.delete("/delete_department/:id", (req, res) => {
  const departmentId = req.params.id;

  // Query to delete the department by ID
  const sql = "DELETE FROM department WHERE id = ?";
  
  connection.query(sql, [departmentId], (err, result) => {
    if (err) {
      console.error("Error deleting department:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows > 0) {
      return res.json({ Status: true });
    } else {
      return res.json({ Status: false, Error: "Department not found" });
    }
  });
});


router.post("/add_employee", (req, res) => {

  const { name, email, password, role, experience, department_id, salary } = req.body;

  if (!name || !email || !password || !role || !department_id || !salary) {
    return res.status(400).json({ Status: false, Error: "Missing required fields" });
  }

  const sql = `INSERT INTO employees (name, email, password, role, experience, department_id, salary) VALUES (?,?,?,?,?,?,?)`;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Password Hashing Error:", err);
      return res.status(500).json({ Status: false, Error: "Password Hashing Error" });
    }

    const values = [
      name,
      email,
      hash,
      role,
      experience || 0, // Default experience to 0 if not provided
      department_id,
      salary,
    ];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Database Query Error:", err);
        return res.status(500).json({ Status: false, Error: "Database Query Error" });
      }
      return res.json({ Status: true, Result: result });
    });
  });
});

router.get("/get_employees", (req, res) => {
  const sql = `
    SELECT 
      employees.id AS employeeId, 
      employees.name, 
      department.name AS department, 
      employees.role 
    FROM employees 
    LEFT JOIN department ON employees.department_id = department.id;
  `;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});


router.delete("/delete_employee/:employeeId", (req, res) => {
  const { employeeId } = req.params;  // Extract employeeId from URL params

  // Update the query to use the correct column name 'id'
  const sql = "DELETE FROM employees WHERE id = ?"; // Use 'id' instead of 'employeeId'

  connection.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res.json({ Status: false, Message: "Employee not found" });
    }

    return res.json({ Status: true, Message: "Employee deleted successfully" });
  });
});

router.put("/edit_employee/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const { name, email, password, role, experience, department_id, salary } = req.body;

  if (!name || !email || !password || !role || !department_id || !salary) {
    return res.status(400).json({ Status: false, Error: "Missing required fields" });
  }

  // If password is provided, hash it; otherwise, retain the existing password
  const passwordUpdate = password ? bcrypt.hashSync(password, 10) : undefined;

  const sql = `UPDATE employees SET 
    name = ?, 
    email = ?, 
    password = ?, 
    role = ?, 
    experience = ?, 
    department_id = ?, 
    salary = ? 
    WHERE id = ?`;

  const values = [
    name,
    email,
    passwordUpdate || null, // If password is not provided, set it as null
    role,
    experience,
    department_id,
    salary,
    employeeId,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ Status: false, Error: "Database Query Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Employee not found" });
    }

    return res.json({ Status: true, Result: result });
  });
});

router.get("/get_employee_by_id/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const sql = "SELECT * FROM employees WHERE id = ?";
  connection.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    if (result.length === 0) {
      return res.json({ Status: false, Error: "Employee not found" });
    }
    return res.json({ Status: true, Result: result });
  });
});


router.post("/allocate_work", (req, res) => {
  const { employee_id, title, description, deadline, priority } = req.body;

  if (!employee_id || !title || !deadline) {
    return res.status(400).json({ Status: false, Error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO work_allocation (employee_id, title, description, deadline, priority)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(sql, [employee_id, title, description, deadline, priority], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    // Optionally, add notification logic here
    res.json({ Status: true, Result: result });
  });
});

router.get("/get_tasks", (req, res) => {
  const sql = `
    SELECT 
      work_allocation.id AS taskId, 
      work_allocation.title, 
      work_allocation.description, 
      work_allocation.deadline, 
      work_allocation.priority, 
      employees.name AS employee_name 
    FROM work_allocation 
    JOIN employees ON work_allocation.employee_id = employees.id
  `;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    return res.json({ Status: true, Result: result });
  });
});

router.get("/get_task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const sql = "SELECT * FROM work_allocation WHERE id = ?";
  connection.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching task:", err);
      return res.status(500).json({ Status: false, Error: "Error fetching task" });
    }

    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "Task not found" });
    }

    return res.json(result[0]);  // Return the task details as JSON
  });
});


router.put("/edit_task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline, priority } = req.body;

  if (!title || !description || !deadline || !priority) {
    return res.status(400).json({ Status: false, Error: "Missing required fields" });
  }

  const sql = `
    UPDATE work_allocation
    SET title = ?, description = ?, deadline = ?, priority = ?
    WHERE id = ?
  `;
  
  const values = [title, description, deadline, priority, taskId];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Task not found" });
    }

    return res.json({ Status: true, Message: "Task updated successfully" });
  });
});


router.delete("/delete_task/:taskId", (req, res) => {
  const { taskId } = req.params;

  const sql = "DELETE FROM work_allocation WHERE id = ?";

  connection.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows > 0) {
      return res.json({ Status: true, Message: "Task deleted successfully" });
    } else {
      return res.json({ Status: false, Error: "Task not found" });
    }
  });
});


// Get all leave requests for admin
router.get("/leave_requests", (req, res) => {
  const sql = "SELECT * FROM leave_requests";

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Error fetching leave requests" });
    }

    return res.json({ Status: true, Result: result });
  });
});


// Approve or Reject a leave request
router.put("/leave_requests/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // 'approved' or 'rejected'

  if (status !== 'approved' && status !== 'rejected') {
    return res.status(400).json({ Status: false, Error: "Invalid status" });
  }

  // Update the leave request status in the database
  const updateStatusSql = "UPDATE leave_requests SET status = ? WHERE id = ?";
  connection.query(updateStatusSql, [status, id], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Error updating leave request status" });
    }

    if (result.affectedRows > 0) {
      // If approved, update leave balance (if applicable)
      if (status === 'approved') {
        const requestSql = "SELECT * FROM leave_requests WHERE id = ?";
        connection.query(requestSql, [id], (err, requestResult) => {
          if (err) {
            console.error("Error fetching leave request details:", err);
            return res.json({ Status: false, Error: "Error fetching leave request details" });
          }

          const { employee_id, leave_type } = requestResult[0];

          // Logic for updating leave balance (deduct from annual or sick leave)
          let leaveBalanceSql = "";
          if (leave_type === 'annual') {
            leaveBalanceSql = "UPDATE leave_balances SET annual_leave = annual_leave - 1 WHERE employee_id = ?";
          } else if (leave_type === 'sick') {
            leaveBalanceSql = "UPDATE leave_balances SET sick_leave = sick_leave - 1 WHERE employee_id = ?";
          }

          if (leaveBalanceSql) {
            connection.query(leaveBalanceSql, [employee_id], (err) => {
              if (err) {
                console.error("Error updating leave balance:", err);
                return res.json({ Status: false, Error: "Error updating leave balance" });
              }
              return res.json({ Status: true, Message: "Leave request approved and balance updated" });
            });
          }
        });
      } else {
        return res.json({ Status: true, Message: "Leave request rejected" });
      }
    } else {
      return res.json({ Status: false, Error: "Leave request not found" });
    }
  });
});




export { router as adminRouter };
