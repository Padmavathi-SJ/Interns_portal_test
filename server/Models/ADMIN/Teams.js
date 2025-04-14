import db from "../../DB/db.js";

export const createTeam = async (team_name, team_members) => {
  const query = `insert into teams (team_name, team_members) values(?,?)`;
  return new Promise((resolve, reject) => {
    db.query(query, [team_name, team_members], (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const get_teams = async () => {
  const query = `select teams.team_id, teams.team_name, teams.team_members, DATE_FORMAT(teams.created_at, '%d %b %y') AS created_at
                   from teams`;
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
};

export const get_team = async(team_id) => {
    const query = `select team_name, team_members from teams where team_id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [team_id], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const edit_team = async(teamId, team_name, team_members)  => {
    const query = `update teams set team_name = ?, team_members = ? where team_id = ?`;
    return new Promise((resolve, reject) => {
        db.query(query, [team_name, team_members, teamId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}

export const delete_team = async (teamId) => {
    const query = `delete from teams where team_id = ? `;
    return new Promise((resolve, reject) => {
        db.query(query, [teamId], (err, result) => {
            if(err) return reject(err);
            return resolve(result);
        })
    })
}