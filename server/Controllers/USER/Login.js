import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { login } from '../../Models/USER/Login.js';

dotenv.config();

const JWR_SECRET = process.env.JWT_KEY;

export const UserLogin = async(req, res) => {
    const {employee_id, email, password} = req.body;

    if(!employee_id || !email || !password){
        return res.status(400).json({ Status: false, Error: "All fields are required." });
    }

    try{
        const employee = await login(employee_id, email);

        const isPasswordValid = await bcrypt.compare(password, employee.password);
        if(!isPasswordValid){
            return res.status(400).json({Status: false, Error: "Invalid Credentials."});
        }

        const token = jwt.sign(
            { id: employee.id, role: employee.role },
            JWR_SECRET,
            { expiresIn: "3h" }
        );

        console.log("Generated token: ", token);
        
        res.json({
            Status: true,
            Message: "Login successful.",
            token,
        });
    } catch (err) {
        console.error("Password verification error:", err);
        if (err.message === "Employee not found") {
            return res.status(404).json({ Status: false, Error: "Employee not found." });
        }
        res.status(500).json({ Status: false, Error: "Internal server error." });
    }
}