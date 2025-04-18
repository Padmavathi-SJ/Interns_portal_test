import db from "../../DB/db.js";

export const totalemployees = async () => {
  const query = `select count(*) from employees`;
  return new Promise((resolve, reject) => {
    return db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const totalDepartments = async () => {
  const query = `select count(*) from department`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const totalTeams = async () => {
  const query = `select count(*) from teams`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const taskAssignedCount = async () => {
  const query = `select count(distinct employee_id) from work_allocation`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const taskStatusCountByDate = async (date) => {
  const query = `
      select 
      count(*) as total,
      sum(status = 'Completed') as completed,
      sum(status = 'pending') as pending,
      sum(status = 'In Progress') as in_progress
      from work_allocation
      where date = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [date], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const TeamTaskStatusCountByDate = async (date) => {
  const query = `
      select 
      count(*) as total,
      sum(status = 'Completed') as completed,
      sum(status = 'Pending') as pending,
      sum(status = 'In Progress') as in_progress
      from team_work_allocation
      where date = ?`;
  return new Promise((resolve, reject) => {
    db.query(query, [date], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const getAverageAttendance = async () => {
  const query = `
      SELECT
        ROUND(AVG(attendance_percentage), 2) AS average_attendance
      FROM (
        SELECT
          e.id AS employee_id,
          ROUND(((30 - IFNULL(SUM(DATEDIFF(l.to_date, l.from_date) + 1), 0)) / 30) * 100, 2) AS attendance_percentage
        FROM employees e
        LEFT JOIN leave_requests l
          ON e.id = l.employee_id AND l.status = 'Approved'
        GROUP BY e.id
      ) AS employee_attendance;
    `;

  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const PendingLeavesCount = async () => {
  const query = `select count(*) from leave_requests where status = 'Pending'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const PendingFeedbackCount = async () => {
  const query = `select count(*) from feedback where status = 'Pending'`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};


export const AdminsCount = async () => {
    const query = `select count(*) from admin`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      });
    });
  };
  
  
  