import { get_employee, team_count, leave_dashboard, getLeaveCount,
         getFeedbackCount, getTeamContribution, getWorkCompletion
 } from "../../Models/USER/Dashboard-Metrics.js";

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
        const team_count_value = fetched[0]?.team_count || 0;
        return res.json({ status: true, TeamCount: team_count_value});
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


export const getEmployeePerformanceSummary = async (req, res) => {
  try {
    const { id: employeeId } = req.user;
    const { month, year } = req.query;

    const monthMap = {
      Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, June: 6,
      July: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
    };

    const selectedMonth = monthMap[month];
    const selectedYear = year || new Date().getFullYear();

    const [leaveCount, feedbackCount, teamContribution, workCompletion] = await Promise.all([
      getLeaveCount(employeeId, selectedMonth, selectedYear),
      getFeedbackCount(employeeId, selectedMonth),
      getTeamContribution(employeeId, selectedMonth),
      getWorkCompletion(employeeId, selectedMonth),
    ]);

    const feedback_count = feedbackCount[0]?.feedback_count || 0;
    const team_contribution_count = teamContribution[0]?.team_contribution || 0;
    const work_completion = workCompletion[0]?.completed_tasks || 0;

    return res.json({
      status: true,
      Data: {
        leaveCount,
        feedback_count,
        team_contribution_count,
        work_completion,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: "Error fetching employee performance summary",
      details: error.message,
    });
  }
};
