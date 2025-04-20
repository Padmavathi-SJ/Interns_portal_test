import { get_employee, team_count } from "../../Models/USER/Dashboard-Metrics.js";

export const fetch_employee = async(req, res) => {
    const {id: employeeId} = req.user;
        try{
                const fetched = await get_employee(employeeId);
                return res.json({ status: true, EmployeeDetails: fetched});
            } catch (error) {
            console.log("Error fetching leave requests: ", error);
            return res
                .status(500)
                .json({ status: false, Error: "Database Query Error" });
            }
}

export const fetch_teamCount = async(req, res) => {
    const {id: employeeId} = req.user;
    try{
        const fetched = await team_count(employeeId);
        return res.json({ status: true, TeamCount: fetched});
    } catch (error) {
    console.log("Error fetching team count: ", error);
    return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }
}
