import { get_employee, team_count, leave_dashboard } from "../../Models/USER/Dashboard-Metrics.js";

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


export const leave_summary = async (req, res) => {
  const { id: employeeId } = req.user;

  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JS months are 0-based
    const currentYear = currentDate.getFullYear();

    let totalLeaveDays = 0;
    let onDutyDays = 0;
    let internalODDays = 0;
    let internalTrainingDays = 0;

    const result = await leave_dashboard(employeeId, currentMonth, currentYear);

    result.forEach((request) => {
      const fromDate = new Date(request.from_date);
      const toDate = new Date(request.to_date);
      const leaveDays = Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;

      switch (request.leave_type.toUpperCase()) {
        case 'ON DUTY':
          onDutyDays += leaveDays;
          break;
        case 'INTERNAL OD':
          internalODDays += leaveDays;
          break;
        case 'INTERNAL TRAINING':
          internalTrainingDays += leaveDays;
          break;
        case 'LEAVE':
          totalLeaveDays += leaveDays;
          break;
        default:
          break;
      }
    });

    // Total days in current month (dynamic instead of fixed 30)
    const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const presentDays = totalDaysInMonth - (totalLeaveDays + onDutyDays + internalODDays + internalTrainingDays);
    const presentPercentage = ((presentDays / totalDaysInMonth) * 100).toFixed(2);

    return res.json({
      status: true,
      Data: {
        totalDaysInMonth,
        totalLeaveDays,
        onDutyDays,
        internalODDays,
        internalTrainingDays,
        presentDays,
        presentPercentage: `${presentPercentage}%`
      }
    });
  } catch (error) {
    console.error('Error fetching leave calculation:', error);
    return res.status(500).json({
      status: false,
      error: 'Database Query Error'
    });
  }
};
