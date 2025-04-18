import { PerformanceByMonth } from "../../Models/ADMIN/Performance.js";

export const fetchPerformanceByMonth = async (req, res) => {
  const { month } = req.query; // Expecting format YYYY-MM
  try {
    const performance = await PerformanceByMonth(month);
    return res.json({ status: true, PerformanceType: performance });
  } catch (error) {
    console.error("Error fetching monthly performance data", error);
    return res.status(500).json({ status: false, Error: "Database Query Error" });
  }
};
