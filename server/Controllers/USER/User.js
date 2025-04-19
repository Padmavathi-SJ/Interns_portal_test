import { userDetails } from '../../Models/USER/User.js';

export const get_user_details = async(req,res) => {
    const {id: employeeId} = req.user;

    try{
        const fetched = await userDetails(employeeId);
        return res.json({ status: true, EmployeeDetails: fetched[0] });
  } catch (error) {
    console.log("Error fetching employee details: ", error);
    return res
      .status(500)
      .json({ status: false, Error: "Database Query Error" });
  }
}

