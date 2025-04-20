import dotenv from 'dotenv';
import express from 'express';
import jwt, { decode } from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_KEY;

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.header("Authorization");
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    //console.log("Received token: ", token);

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
          //  console.log("token verification failed: ", err);
            return res.status(401).json({message: 'Invalid or expired token'});
        }

        req.user = decoded;
       // console.log("Decoded userToken: ", decoded);

        next();
    });
};


export default verifyToken;