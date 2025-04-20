import db from '../../DB/db.js';

export const get_teams = async(employeeId) => {
    const query = `select team_id, team_name, team_members from teams
                      WHERE JSON_CONTAINS(team_members, JSON_ARRAY(?), '$')`;
    return new Promise((resolve, reject) => {
        db.query(query, [employeeId], (err, result) => {
            if(err) return reject(err);
           

            return resolve(result);
        })
    })
}

export const get_team_tasks = async(teamId) => {
    const query = `select id, team_id, title, description, deadline, priority, status, created_at
                    from team_work_allocation where team_id = ? `;
        return new Promise((resolve, reject) => {
            db.query(query, [teamId], (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            })
        })
}

export const update_team_tasks = async(status, teamId, taskId) => {
    const query = `update team_work_allocation set status = ? where team_id = ? and id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [status, teamId, taskId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}