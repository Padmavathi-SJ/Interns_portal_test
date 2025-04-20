import { feedback, get_feedbacks } from "../../Models/USER/Feedback.js";

export const post_feedback = async(req, res) => {
    const {employee_id, feedback_type, description, priority} = req.body;

  try{
          const posted = await feedback(employee_id, feedback_type, description, priority);
          return res.json({ status: true, Result: posted});
      } catch (error) {
        console.log("Error pushing feedback: ", error);
        return res
          .status(500)
          .json({ status: false, Error: "Database Query Error" });
      }
}

export const fetch_feedbacks = async(req, res) => {
    const {id: employeeId} = req.user;
    try{
        const fetched = await get_feedbacks(employeeId);
        return res.json({ status: true, Feedbacks: fetched});
    } catch (error) {
      console.log("Error fetching feedbacks: ", error);
      return res
        .status(500)
        .json({ status: false, Error: "Database Query Error" });
    }
}