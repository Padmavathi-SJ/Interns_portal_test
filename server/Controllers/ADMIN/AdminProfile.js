import jwt from "jsonwebtoken";
import { profile } from "../../Models/ADMIN/AdminProfile.js";

export const AdminProfile = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: false, error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const email = decoded.email;

    const result = await profile(email);

    if (result.length > 0) {
      return res.status(200).json({
        status: true,
        name: result[0].name,
        email: result[0].email,
      });
    } else {
      return res.status(404).json({ status: false, error: "Admin not found" });
    }
  } catch (err) {
    console.error("Token verification or DB error:", err);
    return res.status(500).json({ status: false, error: "Internal server error" });
  }
};
