import express from "express";
import connection from "../DB/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_KEY;

// Configure Multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder =
      file.fieldname === "profile_img"
        ? "uploads/profile_images/"
        : "uploads/resumes/";
    cb(null, folder); // Different folders for profile images and resumes
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Ensure unique filenames
  },
});

const upload = multer({ storage });

/*
router.post("/adminLogin", (req, res) => {
  const sql = "SELECT * FROM admin WHERE email = ?";
  connection.query(sql, [req.body.email], async (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });

    if (result.length > 0) {
      // Retrieve stored hash from the database
      const storedPasswordHash = result[0].password;

      // Compare the provided password with the stored hash using bcrypt
      const isMatch = await bcrypt.compare(
        req.body.password,
        storedPasswordHash
      );

      if (isMatch) {
        const email = result[0].email;
        const token = jwt.sign(
          { role: "admin", email: email },
          JWT_SECRET, // Use JWT_SECRET from environment variable
          { expiresIn: "1d" }
        );
        res.cookie("token", token);
        return res.json({ loginStatus: true });
      } else {
        return res.json({
          loginStatus: false,
          Error: "Wrong email or password",
        });
      }
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});


router.get("/admins", (req, res) => {
  const sql = "SELECT * FROM admin";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching admins:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Database Query Error" });
    }
    return res.json({ Status: true, Admins: results });
  });
});

router.post("/add_admin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Password Hashing Error:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Password Hashing Error" });
    }

    const sql = "INSERT INTO admin (email, password) VALUES (?, ?)";
    const values = [email, hash];

    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error inserting new admin:", err);
        return res
          .status(500)
          .json({ Status: false, Error: "Database Query Error" });
      }
      return res.json({ Status: true, Result: result });
    });
  });
});


router.get("/get_departments", (req, res) => {
  const sql = "SELECT * FROM department";
  connection.query(sql, (err, result) => {
    if (err) return res.json({ Status: false, Error: "Query Error" });
    return res.json({ Status: true, Result: result });
  });
});


// Route to get employees by department_id
router.get("/get_employees_by_department/:departmentId", (req, res) => {
  const { departmentId } = req.params;

  const sql = `SELECT * FROM employees WHERE department_id = ?`;

  //  console.log('Received departmentId:', departmentId);

  connection.query(sql, [departmentId], (err, result) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Database Query Error" });
    }

    // console.log('SQL Query:', sql);
    // console.log('Query Result:', result);

    if (result.length > 0) {
      res.json({ Status: true, Result: result });
    } else {
      res.json({
        Status: false,
        Message: "No employees found for this department",
      });
    }
  });
});

// Route to get employee details by employee_id
router.get("/get_employee_details/:employeeId", (req, res) => {
  const { employeeId } = req.params;

  const sql = `SELECT id, name, email, role, experience, department_id, salary, degree, university, graduation_year, skills, certifications, mobile_no, address, resume, profile_img FROM employees WHERE id = ?`;

  connection.query(sql, [employeeId], (err, result) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res.status(500).json({ Status: false, Error: "Database Query Error" });
    }

    if (result.length > 0) {
      const employeeDetails = result[0];

      if (employeeDetails.resume) {
        // Ensure the resume path doesn't get prepended incorrectly
        employeeDetails.resume = `/uploads/resumes/${employeeDetails.resume.replace(/\\/g, '/')}`;
      } else {
        employeeDetails.resume = null;
      }

      res.json({ Status: true, Result: employeeDetails });
    } else {
      res.json({ Status: false, Error: "Employee not found" });
    }
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


router.delete("/delete_department/:departmentId", (req, res) => {
  const { departmentId } = req.params;

  // Find employees in the department
  const findEmployeesSql = "SELECT id FROM employees WHERE department_id = ?";
  connection.query(findEmployeesSql, [departmentId], (err, employees) => {
    if (err) {
      console.error("Error finding employees:", err);
      return res.json({ Status: false, Error: "Error finding employees" });
    }

    const employeeIds = employees.map((emp) => emp.id);

    if (employeeIds.length > 0) {
      // Delete feedback for employees in the department
      const deleteFeedbackSql = "DELETE FROM feedback WHERE employee_id IN (?)";
      connection.query(deleteFeedbackSql, [employeeIds], (err) => {
        if (err) {
          console.error("Error deleting feedback:", err);
          return res.json({ Status: false, Error: "Error deleting feedback" });
        }

        // Delete work_allocation for employees in the department
        const deleteWorkAllocationSql =
          "DELETE FROM work_allocation WHERE employee_id IN (?)";
        connection.query(deleteWorkAllocationSql, [employeeIds], (err) => {
          if (err) {
            console.error("Error deleting work allocation:", err);
            return res.json({
              Status: false,
              Error: "Error deleting work allocation",
            });
          }

          // Delete leave_requests for employees in the department
          const deleteLeaveRequestsSql =
            "DELETE FROM leave_requests WHERE employee_id IN (?)";
          connection.query(deleteLeaveRequestsSql, [employeeIds], (err) => {
            if (err) {
              console.error("Error deleting leave requests:", err);
              return res.json({
                Status: false,
                Error: "Error deleting leave requests",
              });
            }

            // Delete employees in the department
            const deleteEmployeesSql =
              "DELETE FROM employees WHERE department_id = ?";
            connection.query(deleteEmployeesSql, [departmentId], (err) => {
              if (err) {
                console.error("Error deleting employees:", err);
                return res.json({
                  Status: false,
                  Error: "Error deleting employees",
                });
              }

              // Finally, delete the department
              const deleteDepartmentSql = "DELETE FROM department WHERE id = ?";
              connection.query(
                deleteDepartmentSql,
                [departmentId],
                (err, result) => {
                  if (err) {
                    console.error("Error deleting department:", err);
                    return res.json({
                      Status: false,
                      Error: "Error deleting department",
                    });
                  }

                  if (result.affectedRows === 0) {
                    return res.json({
                      Status: false,
                      Message: "Department not found",
                    });
                  }

                  return res.json({
                    Status: true,
                    Message:
                      "Department and all related data deleted successfully",
                  });
                }
              );
            });
          });
        });
      });
    } else {
      // No employees, directly delete the department
      const deleteDepartmentSql = "DELETE FROM department WHERE id = ?";
      connection.query(deleteDepartmentSql, [departmentId], (err, result) => {
        if (err) {
          console.error("Error deleting department:", err);
          return res.json({
            Status: false,
            Error: "Error deleting department",
          });
        }

        if (result.affectedRows === 0) {
          return res.json({ Status: false, Message: "Department not found" });
        }

        return res.json({
          Status: true,
          Message: "Department deleted successfully",
        });
      });
    }
  });
});


// Route to add an employee
router.post(
  "/add_employee",
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "profile_img", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      name,
      email,
      password,
      role,
      experience,
      department_id,
      salary,
      degree,
      university,
      graduation_year,
      skills,
      certifications,
      mobile_no,
      address,
    } = req.body;

    if (!name || !email || !password || !role || !department_id || !salary || !degree || !university || !graduation_year || !mobile_no || !address) {
      return res.status(400).json({ Status: false, Error: "Missing required fields" });
    }

    const resume = req.files?.resume?.[0]?.path.replace(/^.*uploads\//, 'uploads/resumes/') || null;
    const profileImg = req.files?.profile_img?.[0]?.path.replace(/^.*uploads\//, 'uploads/profile_images/') || null;
    

    const sql = `INSERT INTO employees (name, email, password, role, experience, department_id, salary, degree, university, graduation_year, skills, certifications, mobile_no, address, resume, profile_img) 
                 VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

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
        experience || 0,
        department_id,
        salary,
        degree,
        university,
        graduation_year,
        skills || "",
        certifications || "",
        mobile_no,
        address,
        resume,
        profileImg,
      ];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error("Database Query Error:", err);
          return res.status(500).json({ Status: false, Error: "Database Query Error" });
        }
        return res.json({ Status: true, Result: result });
      });
    });
  }
);


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
  const { employeeId } = req.params;

  // Delete feedback related to the employee
  const deleteFeedbackSql = "DELETE FROM feedback WHERE employee_id = ?";
  connection.query(deleteFeedbackSql, [employeeId], (err) => {
    if (err) {
      console.error("Error deleting feedback:", err);
      return res.json({ Status: false, Error: "Error deleting feedback" });
    }

    // Delete work_allocation related to the employee
    const deleteWorkAllocationSql =
      "DELETE FROM work_allocation WHERE employee_id = ?";
    connection.query(deleteWorkAllocationSql, [employeeId], (err) => {
      if (err) {
        console.error("Error deleting work allocation:", err);
        return res.json({
          Status: false,
          Error: "Error deleting work allocation",
        });
      }

      // Delete leave_requests related to the employee
      const deleteLeaveRequestsSql =
        "DELETE FROM leave_requests WHERE employee_id = ?";
      connection.query(deleteLeaveRequestsSql, [employeeId], (err) => {
        if (err) {
          console.error("Error deleting leave requests:", err);
          return res.json({
            Status: false,
            Error: "Error deleting leave requests",
          });
        }

        // Finally, delete the employee
        const deleteEmployeeSql = "DELETE FROM employees WHERE id = ?";
        connection.query(deleteEmployeeSql, [employeeId], (err, result) => {
          if (err) {
            console.error("Error deleting employee:", err);
            return res.json({
              Status: false,
              Error: "Error deleting employee",
            });
          }

          if (result.affectedRows === 0) {
            return res.json({ Status: false, Message: "Employee not found" });
          }

          return res.json({
            Status: true,
            Message: "Employee and all related data deleted successfully",
          });
        });
      });
    });
  });
});


router.put("/edit_employee/:employeeId", (req, res) => {
  const { employeeId } = req.params;
  const {
    name,
    email,
    password,
    role,
    experience,
    department_id,
    salary,
    degree,
    university,
    graduation_year,
    skills,
    certifications,
    mobile_no,
    address,
  } = req.body;

  if (!name || !email || !password || !role || !department_id || !salary) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
  }

  const passwordUpdate = password ? bcrypt.hashSync(password, 10) : undefined;

  const sql = `UPDATE employees SET 
    name = ?, 
    email = ?, 
    password = ?, 
    role = ?, 
    experience = ?, 
    department_id = ?, 
    salary = ?, 
    degree = ?, 
    university = ?, 
    graduation_year = ?, 
    skills = ?, 
    certifications = ?, 
    mobile_no = ?, 
    address = ? 
    WHERE id = ?`;

  const values = [
    name,
    email,
    passwordUpdate || null,
    role,
    experience,
    department_id,
    salary,
    degree,
    university,
    graduation_year,
    skills,
    certifications,
    mobile_no,
    address,
    employeeId,
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Database Query Error:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Database Query Error" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ Status: false, Error: "Employee not found" });
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

*/

router.post("/allocate_work", (req, res) => {
  const { employee_id, title, description, deadline, priority } = req.body;

  if (!employee_id || !title || !deadline) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO work_allocation (employee_id, title, description, deadline, priority)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [employee_id, title, description, deadline, priority],
    (err, result) => {
      if (err) {
        console.error("Query Error:", err);
        return res.status(500).json({ Status: false, Error: "Query Error" });
      }

      // Optionally, add notification logic here
      res.json({ Status: true, Result: result });
    }
  );
});

router.get("/get_tasks", (req, res) => {
  const sql = `
    SELECT 
      work_allocation.id AS taskId, 
      work_allocation.title, 
      work_allocation.description, 
      work_allocation.deadline, 
      work_allocation.priority, 
      work_allocation.status,  -- Include the status field
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

router.get("/get_team_tasks", (req, res) => {
  const sql = `
    SELECT 
  team_work_allocation.id AS taskId, 
  team_work_allocation.title, 
  team_work_allocation.description, 
  team_work_allocation.deadline, 
  team_work_allocation.priority, 
  team_work_allocation.status, 
  teams.team_name AS team_name 
FROM team_work_allocation 
LEFT JOIN teams ON team_work_allocation.team_id = teams.team_id;
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
      return res
        .status(500)
        .json({ Status: false, Error: "Error fetching task" });
    }

    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "Task not found" });
    }

    return res.json(result[0]); // Return the task details as JSON
  });
});

router.put("/edit_task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline, priority } = req.body;

  if (!title || !description || !deadline || !priority) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
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

// Fetch team task by ID
router.get("/get_team_task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const sql = "SELECT * FROM team_work_allocation WHERE id = ?";
  connection.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Error fetching team task:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error fetching team task" });
    }

    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "Team task not found" });
    }

    return res.json(result[0]); // Return the team task details as JSON
  });
});

// Update team task by ID
router.put("/edit_team_task/:taskId", (req, res) => {
  const { taskId } = req.params;
  const { title, description, deadline, priority, status } = req.body;

  if (!title || !description || !deadline || !priority || !status) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
  }

  const sql = `
    UPDATE team_work_allocation
    SET title = ?, description = ?, deadline = ?, priority = ?, status = ?
    WHERE id = ?
  `;

  const values = [title, description, deadline, priority, status, taskId];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Team task not found" });
    }

    return res.json({ Status: true, Message: "Team task updated successfully" });
  });
});

router.delete("/delete_team_task/:taskId", (req, res) => {
  const { taskId } = req.params;

  const sql = "DELETE FROM team_work_allocation WHERE id = ?";

  connection.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows > 0) {
      return res.json({ Status: true, Message: "Team task deleted successfully" });
    } else {
      return res.json({ Status: false, Error: "Team task not found" });
    }
  });
});


// Get all leave requests for admin

router.get("/leave_requests", (req, res) => {
  const sql = `
    SELECT 
      id, 
      employee_id, 
      leave_type, 
      DATE_FORMAT(from_date, '%d %b %Y') AS from_date, 
      DATE_FORMAT(to_date, '%d %b %Y') AS to_date, 
      DATE_FORMAT(from_time, '%h:%i:%s %p') AS from_time, 
      DATE_FORMAT(to_time, '%h:%i:%s %p') AS to_time, 
      status, 
      Reason,
      created_at,
      updated_at
    FROM leave_requests
  `;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({
        Status: false,
        Error: "Error fetching leave requests",
      });
    }

    return res.json({ Status: true, Result: result });
  });
});


router.get("/leave_request_reason/:id", (req, res) => {
  const leaveRequestId = req.params.id; // Fetch leave request id from the URL parameter
  const sql = "SELECT Reason FROM leave_requests WHERE id = ?"; // Modify query to use leave request ID

  connection.query(sql, [leaveRequestId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Error fetching reason" });
    }

    if (result.length > 0) {
      return res.json({ Status: true, Reason: result[0].Reason }); // Make sure to return the correct column name
    } else {
      return res.json({ Status: false, Error: "No reason found" });
    }
  });
});

// Approve or Reject a leave request
router.put("/leave_requests/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ Status: false, Error: "Invalid status" });
  }

  // Update the leave request status in the database
  const updateStatusSql = "UPDATE leave_requests SET status = ? WHERE id = ?";
  connection.query(updateStatusSql, [status, id], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({
        Status: false,
        Error: "Error updating leave request status",
      });
    }

    if (result.affectedRows > 0) {
      return res.json({
        Status: true,
        Message: "Leave request status updated successfully",
      });
    } else {
      return res.json({ Status: false, Error: "Leave request not found" });
    }
  });
});

router.get("/dashboard_metrics", async (req, res) => {
  try {
    // Queries for the metrics
    const queries = {
      totalEmployees: "SELECT COUNT(*) AS total FROM employees",
      pendingLeaves: "SELECT COUNT(*) AS total FROM leave_requests WHERE status = 'Pending'",
      totalDepartments: "SELECT COUNT(*) AS total FROM department",
      totalTasks: "SELECT COUNT(*) AS total FROM work_allocation",
      pendingFeedbacks: "SELECT COUNT(*) AS total FROM feedback WHERE status = 'Pending'",
      totalTeams: "SELECT COUNT(*) AS total FROM teams",
      totalAdmins: "SELECT COUNT(*) AS total FROM admin",
    };

    // Execute all queries in parallel
    const [
      employeeResult, 
      leaveResult, 
      departmentResult, 
      taskResult, 
      feedbackResult, 
      teamResult, 
      adminResult
    ] = await Promise.all([
      new Promise((resolve, reject) =>
        connection.query(queries.totalEmployees, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(queries.pendingLeaves, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(queries.totalDepartments, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(queries.totalTasks, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(queries.pendingFeedbacks, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(queries.totalTeams, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(queries.totalAdmins, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      ),
    ]);

    // Build the response object
    const metrics = {
      totalEmployees: employeeResult[0].total,
      pendingLeaveRequests: leaveResult[0].total,
      totalDepartments: departmentResult[0].total,
      totalTasks: taskResult[0].total,
      pendingFeedbacks: feedbackResult[0].total,
      totalTeams: teamResult[0].total,
      totalAdmins: adminResult[0].total,
    };

    // Send the response
    res.json({ Status: true, Metrics: metrics });
  } catch (err) {
    console.error("Error fetching dashboard metrics:", err);
    res.status(500).json({ Status: false, Error: "Error fetching dashboard metrics" });
  }
});


// Fetch all feedback
router.get("/feedback", (req, res) => {
  const sql = "SELECT * FROM feedback";

  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Error fetching feedback" });
    }

    return res.json({ Status: true, Result: result });
  });
});

// Approve or Reject feedback
// Update feedback status (approved or rejected)
router.put("/feedback/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ Status: false, Error: "Invalid status" });
  }

  const updateStatusSql = "UPDATE feedback SET status = ? WHERE id = ?";
  connection.query(updateStatusSql, [status, id], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({
        Status: false,
        Error: "Error updating feedback status",
      });
    }

    if (result.affectedRows > 0) {
      return res.json({
        Status: true,
        Message: "Feedback status updated successfully",
      });
    } else {
      return res.json({ Status: false, Error: "Feedback not found" });
    }
  });
});

// Update feedback solution
router.put("/feedback/:id/solution", (req, res) => {
  const { id } = req.params;
  const { solution } = req.body;

  if (!solution) {
    return res
      .status(400)
      .json({ Status: false, Error: "Solution cannot be empty" });
  }

  const updateSolutionSql = "UPDATE feedback SET solution = ? WHERE id = ?";
  connection.query(updateSolutionSql, [solution, id], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({
        Status: false,
        Error: "Error updating feedback solution",
      });
    }

    if (result.affectedRows > 0) {
      return res.json({
        Status: true,
        Message: "Solution updated successfully",
      });
    } else {
      return res.json({ Status: false, Error: "Feedback not found" });
    }
  });
});

/*
router.post("/create_team", (req, res) => {
  const { team_name, team_members, department_id } = req.body;

  // Validate inputs
  if (!team_name || !Array.isArray(team_members) || team_members.length === 0) {
    return res
      .status(400)
      .json({
        Status: false,
        Message:
          "Invalid input. Please provide a valid team name and select members.",
      });
  }

  // Prepare the SQL query to insert the team into the database
  const query =
    "INSERT INTO teams (team_name, team_members, department_id, created_at) VALUES (?, ?, ?, NOW())";

  // Convert the team_members array to JSON format before inserting into the database
  const teamMembersJson = JSON.stringify(team_members);

  connection.query(
    query,
    [team_name, teamMembersJson, department_id],
    (err, results) => {
      if (err) {
        console.error("Error creating team:", err);
        return res
          .status(500)
          .json({ Status: false, Error: "Error creating team." });
      }

      // Return a success response if the team is created
      res.json({
        Status: true,
        Message: "Team created successfully",
        TeamId: results.insertId,
      });
    }
  );
});

router.get("/get_teams", (req, res) => {
  const query = `
    SELECT 
      teams.team_id, 
      teams.team_name, 
      teams.team_members, 
      DATE_FORMAT(teams.created_at, '%d %b %Y') AS created_at, 
      teams.department_id,
      department.name AS department_name
    FROM teams
    LEFT JOIN department ON teams.department_id = department.id
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching teams:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error fetching teams." });
    }

    // Parse team_members JSON to make it easier to work with in the frontend
    const teams = results.map((team) => ({
      ...team,
      team_members: JSON.parse(team.team_members), // Parse the JSON field to get employee IDs
    }));

    res.json({ Status: true, Result: teams });
  });
});
*/


router.get("/get_team/:team_id", (req, res) => {
  const { team_id } = req.params;
  const sql = "SELECT * FROM teams WHERE team_id = ?";

  connection.query(sql, [team_id], (err, result) => {
    if (err) {
      console.error("Error fetching team:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Error fetching team" });
    }

    if (result.length === 0) {
      return res.status(404).json({ Status: false, Error: "Team not found" });
    }

    return res.json({ Status: true, Result: result[0] }); // Return the team details as JSON
  });
});

// Update team details
router.put("/edit_team/:team_id", (req, res) => {
  const { team_id } = req.params;
  const { team_name, team_members } = req.body;

  // Check for required fields in the request body
  if (!team_name || !team_members) {
    return res
      .status(400)
      .json({ Status: false, Error: "Missing required fields" });
  }

  const sql = `
    UPDATE teams
    SET team_name = ?, team_members = ?
    WHERE team_id = ?
  `;

  const values = [team_name, JSON.stringify(team_members), team_id]; // team_members will be stored as a JSON string

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.status(500).json({ Status: false, Error: "Query Error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Team not found" });
    }

    return res.json({ Status: true, Message: "Team updated successfully" });
  });
});

router.delete("/delete_team/:team_id", (req, res) => {
  const { team_id } = req.params;

  if (!team_id) {
    return res
      .status(400)
      .json({ Status: false, Error: "Team ID is required" });
  }

  const sql = `
    DELETE FROM teams
    WHERE team_id = ?
  `;

  connection.query(sql, [team_id], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Database query error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ Status: false, Error: "Team not found" });
    }

    return res.json({ Status: true, Message: "Team deleted successfully" });
  });
});

router.post("/allocate_team_work", (req, res) => {
  const { team_id, title, description, deadline, priority, status } = req.body;

  if (!team_id || !title || !deadline) {
    return res.status(400).json({ Status: false, Message: "Invalid input." });
  }

  const query = `
    INSERT INTO team_work_allocation (team_id, title, description, deadline, priority, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  connection.query(
    query,
    [team_id, title, description, deadline, priority, status],
    (err, results) => {
      if (err) {
        console.error("Error allocating team work:", err);
        return res
          .status(500)
          .json({ Status: false, Error: "Error allocating work." });
      }
      res.json({ Status: true, Message: "Work allocated successfully." });
    }
  );
});


router.post("/add_announcement", async (req, res) => {
  const { category, target, title, description, extraInfo, priority } =
    req.body;

  let targetIdsJson;
  try {
    if (category === "individual") {
      // Fetch employee IDs based on provided names
      const employeeIds = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT id FROM employees WHERE name IN (?)",
          [target],
          (err, results) => {
            if (err) reject(err);
            resolve(results.map((emp) => emp.id));
          }
        );
      });

      targetIdsJson = JSON.stringify(employeeIds);
    } else if (category === "team") {
      const teamIds = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT team_members FROM teams WHERE team_id IN (?)",
          [target],
          (err, results) => {
            if (err) reject(err);
            const allMembers = results.flatMap((team) =>
              JSON.parse(team.team_members)
            );
            resolve(allMembers);
          }
        );
      });

      targetIdsJson = JSON.stringify(teamIds);
    } else if (category === "all") {
      const departmentIds = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT id FROM department WHERE id IN (?)",
          [target],
          (err, results) => {
            if (err) reject(err);
            resolve(results.map((dept) => dept.id));
          }
        );
      });

      const employeeIds = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT id FROM employees WHERE department_id IN (?)",
          [departmentIds],
          (err, results) => {
            if (err) reject(err);
            resolve(results.map((emp) => emp.id));
          }
        );
      });

      targetIdsJson = JSON.stringify(employeeIds);
    } else {
      return res.status(400).json({ Status: false, Error: "Invalid category" });
    }

    const sql = `
      INSERT INTO announcements (category, target_ids, title, description, extra_info, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      sql,
      [category, targetIdsJson, title, description, extraInfo, priority],
      (err, result) => {
        if (err) {
          console.error("Insert Error:", err);
          return res
            .status(500)
            .json({ Status: false, Error: "Failed to add announcement." });
        }
        res.json({ Status: true, Message: "Announcement added successfully." });
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ Status: false, Error: "Internal server error." });
  }
});

router.get("/get_announcements", (req, res) => {
  const query = `
    SELECT id, category, target_ids, title, description, extra_info, priority, created_at
    FROM announcements
    ORDER BY created_at DESC;
  `;

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching announcements:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal server error." });
    }

    res.json({
      Status: true,
      Result: results,
    });
  });
});

// Route to fetch a specific announcement by ID
router.get("/announcements/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM announcements WHERE id = ?";
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching announcement:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal server error." });
    }
    res.json(result[0]);
  });
});

// Route to update a specific announcement by ID
router.put("/announcements/:id", (req, res) => {
  const { id } = req.params;
  const { category, target_ids, title, description, extra_info, priority } =
    req.body;

  const query = `
    UPDATE announcements
    SET category = ?, target_ids = ?, title = ?, description = ?, extra_info = ?, priority = ?
    WHERE id = ?;
  `;

  connection.query(
    query,
    [
      category,
      JSON.stringify(target_ids),
      title,
      description,
      extra_info,
      priority,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating announcement:", err);
        return res
          .status(500)
          .json({ Status: false, Error: "Internal server error." });
      }
      res.json({ Status: true, Message: "Announcement updated successfully." });
    }
  );
});

router.delete("/delete_announcement/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM announcements
    WHERE id = ?;
  `;

  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting announcement:", err);
      return res
        .status(500)
        .json({ Status: false, Error: "Internal server error." });
    }

    res.json({ Status: true, Message: "Announcement deleted successfully." });
  });
});

/*
// Fetch a department by ID
router.get("/get_department_by_id/:departmentId", (req, res) => {
  const { departmentId } = req.params;
  //console.log("Department ID:", departmentId); // Check the ID being passed

  const sql = "SELECT * FROM department WHERE id = ?";
  connection.query(sql, [departmentId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    if (result.length === 0) {
      return res.json({ Status: false, Error: "Department not found" });
    }
    return res.json({ Status: true, Result: result[0] });
  });
});

// Update department details
router.put("/edit_department/:departmentId", (req, res) => {
  const { departmentId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ Status: false, Error: "Department name is required" });
  }

  const sql = "UPDATE department SET name = ? WHERE id = ?";
  connection.query(sql, [name, departmentId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    if (result.affectedRows === 0) {
      return res.json({ Status: false, Error: "Department not found" });
    }
    return res.json({ Status: true, Result: result });
  });
});

// Delete department by ID
router.delete("/delete_department/:departmentId", (req, res) => {
  const { departmentId } = req.params;

  const sql = "DELETE FROM department WHERE id = ?";
  connection.query(sql, [departmentId], (err, result) => {
    if (err) {
      console.error("Query Error:", err);
      return res.json({ Status: false, Error: "Query Error" });
    }
    if (result.affectedRows === 0) {
      return res.json({ Status: false, Error: "Department not found" });
    }
    return res.json({ Status: true, Result: "Department deleted successfully" });
  });
});

*/

export { router as adminRouter };
