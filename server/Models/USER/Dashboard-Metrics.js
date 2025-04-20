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