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
  const { id: employeeId } = req.user;

  const sql = `
    SELECT e.id, e.name, e.email, e.role, e.experience, d.name AS department, 
           e.salary, e.degree, e.university, e.graduation_year, e.skills, 
           e.certifications, e.mobile_no, e.profile_img
    FROM employees e
    JOIN department d ON e.department_id = d.id
    WHERE e.id = ?;
  `;

  connection.query(sql, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching employee details:", err);
      return res.status(500).json({ Status: false, Error: "Internal server error." });
    }

    if (results.length === 0) {
      return res.status(404).json({ Status: false, Message: "Employee not found." });
    }

    const employee = results[0];
   

    res.json({
      Status: true,
      Data: {
        ...employee, // Return the full URL for profile image
        skills: employee.skills ? employee.skills.split(",") : [],
      },
    });
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

// Employee applying for leave
router.post("/apply_leave", (req, res) => {
  // Destructure required fields from the request body
  const { employee_id, leave_type, from_date, to_date, from_time, to_time, Reason } = req.body;

  // Validate the required fields
  if (!employee_id || !leave_type || !from_date || !to_date || !from_time || !to_time || !Reason) {
    return res.status(400).json({ Status: false, Error: "All fields are required." });
  }

  // SQL query to insert leave request
  const sql = `
    INSERT INTO leave_requests (employee_id, leave_type, from_date, to_date, from_time, to_time, Reason, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  // Execute the query
  connection.query(
    sql,
    [employee_id, leave_type, from_date, to_date, from_time, to_time, Reason],
    (err, result) => {
      if (err) {
        console.error("Query Error:", err);
        return res.status(500).json({ Status: false, Error: "Failed to apply leave." });
      }
      // Send the success response
      return res.json({ Status: true, Result: result, status: 'Pending' });
    }
  );
});


// Fetch leave requests for logged-in employee
router.get("/leave_request", verifyToken, (req, res) => {
  // Extract employeeId from the verified token
  const { id: employeeId } = req.user;

  // SQL query to fetch leave requests for the logged-in employee
  const query = "SELECT * FROM leave_requests WHERE employee_id = ?";

  // Execute the query
  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching leave requests:", err);
      return res.status(500).json({ Status: false, Error: "Error fetching leave requests" });
    }

    // Check if there are any results
    if (results.length === 0) {
      return res.json({ Status: false, Message: "You have not applied for any leaves yet." });
    }

    // Send the response with the leave requests
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
           e.university, e.graduation_year, e.skills, e.certifications, e.profile_img
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


router.get("/get_my_team", verifyToken, (req, res) => {
  const { id: employeeId } = req.user;

  const query = `
    SELECT team_id, team_name, team_members
    FROM teams
    WHERE JSON_CONTAINS(team_members, JSON_ARRAY(?), '$');
  `;

  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching team details:", err);
      return res.status(500).json({ Status: false, Error: "Internal server error." });
    }

    if (results.length === 0) {
      return res.json({ Status: false, Message: "You are not part of any team." });
    }

    res.json({ Status: true, Result: results });
  });
});


router.get("/get_team_tasks/:teamId", verifyToken, (req, res) => {
  const { teamId } = req.params;

  const query = `
    SELECT id, team_id, title, description, deadline, priority, status, created_at
    FROM team_work_allocation
    WHERE team_id = ?;
  `;

  connection.query(query, [teamId], (err, results) => {
    if (err) {
      console.error("Error fetching team tasks:", err);
      return res.status(500).json({ Status: false, Error: "Internal server error." });
    }

    if (results.length === 0) {
      return res.json({ Status: false, Message: "No tasks found for the team." });
    }

    res.json({ Status: true, Result: results });
  });
});

// Router to fetch the number of teams the employee is part of
router.get("/get_team_count", verifyToken, (req, res) => {
  const { id: employeeId } = req.user;

  const query = `
    SELECT COUNT(*) AS team_count
    FROM teams
    WHERE JSON_CONTAINS(team_members, JSON_ARRAY(?), '$');
  `;

  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching team count:", err);
      return res.status(500).json({ Status: false, Error: "Internal server error." });
    }

    const teamCount = results[0]?.team_count || 0;

    res.json({ Status: true, Result: { teamCount } });
  });
});


// Route to get leave dashboard data for an employee
router.get("/leave_dashboard", verifyToken, (req, res) => {
  const { id: employeeId } = req.user;

  const currentMonth = new Date().getMonth() + 1; // Get current month (1-12)
  const currentYear = new Date().getFullYear(); // Get current year

  // Query to get leave data for the current month (Including Pending or Approved status if needed)
  const query = `
    SELECT leave_type, from_date, to_date 
    FROM leave_requests 
    WHERE employee_id = ? 
    AND MONTH(from_date) = ? 
    AND YEAR(from_date) = ? 
    AND (status = 'Approved' OR status = 'Pending')  -- Include Pending status if needed
  `;
  
  connection.query(query, [employeeId, currentMonth, currentYear], (err, results) => {
    if (err) {
      console.error("Error fetching leave requests:", err);
      return res.status(500).json({ Status: false, Error: "Error fetching leave requests" });
    }

    if (results.length === 0) {
      return res.json({ Status: false, Message: "No leave data available for this month." });
    }

    let totalLeaveDays = 0;
    let onDutyDays = 0;
    let internalODDays = 0;
    let internalTrainingDays = 0;
    let presentDays = 0;

    // Calculate leave, on-duty, internal OD, and internal training days
    results.forEach((request) => {
      const fromDate = new Date(request.from_date);
      const toDate = new Date(request.to_date);

      const leaveDays = (toDate - fromDate) / (1000 * 3600 * 24) + 1; // Calculate total leave days

      switch (request.leave_type) {
        case "ON DUTY":
          onDutyDays += leaveDays;
          break;
        case "INTERNAL OD":
          internalODDays += leaveDays;
          break;
        case "Internal Training":
          internalTrainingDays += leaveDays;
          break;
        case "Leave":
          totalLeaveDays += leaveDays;
          break;
        default:
          break;
      }
    });

    // Assuming a month has 30 days (this can be adjusted based on the actual month)
    const totalDaysInMonth = 30;
    presentDays = totalDaysInMonth - (totalLeaveDays + onDutyDays + internalODDays + internalTrainingDays);

    // Calculate the percentage of present days
    const presentPercentage = ((presentDays / totalDaysInMonth) * 100).toFixed(2);

    return res.json({
      Status: true,
      Data: {
        totalDaysInMonth,
        totalLeaveDays,
        onDutyDays,
        internalODDays,
        internalTrainingDays,
        presentDays,
        presentPercentage,
      },
    });
  });
});


// Employee performance route with the token verification middleware
router.get("/employee-performance", verifyToken, (req, res) => {
  const { id: employeeId } = req.user;
  const { month, year } = req.query; // include year for filtering

  const monthMap = {
    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
  };

  const selectedMonth = monthMap[month];

  const leaveCountQuery = `
    SELECT COUNT(*) AS leave_count 
    FROM leave_requests 
    WHERE employee_id = ? 
    AND status = 'Approved'
    AND ((MONTH(from_date) = ? AND YEAR(from_date) = ?) 
         OR (MONTH(to_date) = ? AND YEAR(to_date) = ?));
  `;

  const feedbackCountQuery = `
    SELECT COUNT(*) AS feedback_count 
    FROM feedback 
    WHERE employee_id = ? AND MONTH(created_at) = ?`;

  const teamContributionQuery = `
    SELECT COUNT(*) AS team_contribution 
    FROM teams 
    WHERE JSON_CONTAINS(team_members, JSON_ARRAY(?), '$')`;

  const workCompletionQuery = `
    SELECT COUNT(*) AS completed_tasks 
    FROM work_allocation 
    WHERE employee_id = ? AND status = 'Completed' AND MONTH(deadline) = ?`;

    // Use current year if not provided
  const currentYear = new Date().getFullYear();
  const selectedYear = year || currentYear;


  connection.query(leaveCountQuery, [employeeId, selectedMonth, selectedYear, selectedMonth, selectedYear], (err, leaveCountResults) => {
    if (err) return res.status(500).json({ Status: false, Error: "Error fetching leave count" });

    connection.query(feedbackCountQuery, [employeeId, selectedMonth], (err, feedbackCountResults) => {
      if (err) return res.status(500).json({ Status: false, Error: "Error fetching feedback count" });

      connection.query(teamContributionQuery, [employeeId], (err, teamContributionResults) => {
        if (err) return res.status(500).json({ Status: false, Error: "Error fetching team contribution" });

        connection.query(workCompletionQuery, [employeeId, selectedMonth], (err, workCompletionResults) => {
          if (err) return res.status(500).json({ Status: false, Error: "Error fetching work completion" });

          const responseData = {
            leaveCount: leaveCountResults[0]?.leave_count || 0,
            feedbackCount: feedbackCountResults[0]?.feedback_count || 0,
            teamContribution: teamContributionResults[0]?.team_contribution || 0,
            workCompletion: workCompletionResults[0]?.completed_tasks || 0,
          };

          return res.json({ Status: true, Data: responseData });
        });
      });
    });
  });
});



router.get("/get_announcements", verifyToken, (req, res) => {
  const { id: employeeId } = req.user;

  const query = `
    SELECT a.id, a.title, a.description, a.extra_info, a.priority, a.created_at
    FROM announcements a
    WHERE JSON_CONTAINS(a.target_ids, JSON_QUOTE(?), '$');
  `;

  connection.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error("Error fetching announcements:", err);
      return res.status(500).json({ Status: false, Error: "Internal server error." });
    }

    if (results.length === 0) {
      return res.json({ Status: false, Message: "No announcements found for you." });
    }

    res.json({ Status: true, Result: results });
  });
});





export { router as employeeRouter };
