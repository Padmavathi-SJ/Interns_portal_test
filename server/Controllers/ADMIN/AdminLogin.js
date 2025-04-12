import { AdminLogin } from "../../Models/ADMIN/Login.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jwt';

dotenv.config();

export const Login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({ loginStatus: false, Error: "missing required feilds"});
    }

    try{
        const result = await AdminLogin(email);

        if(result.length > 0) {
            const storedPasswordHash = result[0].password;

            const isMatch = await bcrypt.compare(password, storedPasswordHash);

            if(isMatch){
                const token =  jwt.sign(
                    { role: "admin", email: result[0].email},
                    process.env.JWT_KEY,
                    {expiresIn: "1d"}
                );
                res.cookie("token", token);
                return res.json({ loginStatus: true });
            }
            else {
                return res.json({ loginStatus: false,  Error: "Wrong email or password",});
            }
        }
        else {
            return res.json({ loginStatus: false, Error: "Wrong email or password"});
        }
    }
        catch(err) {
            console.log("Error in admin Login: ", err);
        return res.status(500).json({Status: false, Error: "Database Query Error"});
        }
    
};