import db from '../../DB/db.js';

export const get_employee = async (employeeId) => {
  const query = `SELECT e.id, 
                    e.name, 
                    d.name as department,
                    e.role,
                    e.experience,
                    e.mobile_no,
                    e.email,
                    e.salary,
                    e.degree,
                    e.university,
                    e.graduation_year,
                    e.skills,
                    e.certifications,
                    e.address
                FROM employees e
                JOIN department d ON e.department_id = d.id
                WHERE e.id = ?`;

  return new Promise((resolve, reject) => {
    db.query(query, [employeeId], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const team_count = async(employeeId) => {
    const query = `select count(*) as team_count
                    from teams 
                    where JSON_CONTAINS(team_members, JSON_ARRAY(?), '$')`;
    return new Promise((resolve, reject) => {
        db.query(query, [employeeId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const leave_dashboard = async(employeeId, currentMonth, currentYear) => {
    const query = `select leave_type, from_date, to_date
                    from leave_requests
                    where employee_id = ? 
                    and month(from_date) = ?
                    and year(from_date) = ?
                    and (status = 'Approved' or status = 'Pending' 
                    )`;

    return new Promise((resolve, reject) =>  {
        db.query(query, [employeeId, currentMonth, currentYear], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const getLeaveCount = (employeeId, month, year) => {
    const query = `
      SELECT COUNT(*) AS leave_count 
      FROM leave_requests 
      WHERE employee_id = ? 
      AND status = 'Approved'
      AND ((MONTH(from_date) = ? AND YEAR(from_date) = ?) 
           OR (MONTH(to_date) = ? AND YEAR(to_date) = ?));
    `;
  
    return new Promise((resolve, reject) => {
      db.query(query, [employeeId, month, year, month, year], (err, result) => {
        if (err) return reject(err);
        return resolve(result[0]?.leave_count || 0); // return numeric value
      });
    });
  };
  

export const getFeedbackCount = async(employeeId, month) => {
    const query = `select count(*) as feedback_count
                    from feedback
                    where employee_id = ? and month(created_at) = ?
                    `;
    return new Promise((resolve, reject) => {
        db.query(query, [employeeId, month], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const getTeamContribution = async(employeeId) => {
    const query = `select count(*) as team_contribution
                    from teams
                    where JSON_CONTAINS(team_members, JSON_ARRAY(?), '$')
                    `;

    return new Promise((resolve, reject) => {
        db.query(query, [employeeId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const getWorkCompletion = async(employeeId, month) => {
    const query = `select count(*) as completed_tasks 
                    from work_allocation 
                    where employee_id = ?
                    and status = 'Completed'
                    and month(deadline)
                    `;
        return new Promise((resolve, reject) => {
            db.query(query, [employeeId, month], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
}