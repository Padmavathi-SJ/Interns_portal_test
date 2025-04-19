import dotenv from 'dotenv';
import express from 'express';
import jwt, { decode } from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_KEY;

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
if (!token) {
    return res.status(401).json({ message: "Token not provided, Unauthorized" });
}

    console.log("Received token: ", token);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
            console.log("token verification failed: ", err);
            return res.status(401).json({message: 'Invalid or expired token'});
        }

        req.user = decoded;
        console.log("Decoded userToken: ", decoded);

        next();
    });
};


export default verifyToken;