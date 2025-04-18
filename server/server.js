import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { adminRouter } from './Routes/AdminRoute.js';  // Import the route for file uploads
import { employeeRouter } from './Routes/EmployeeRoutes.js';  // Import other routes if needed
import AdminRouter from './AdminRouter.js';

const app = express();

// CORS configuration to allow credentials and specific origin
app.use(cors({
  origin: "http://localhost:5173", // explicitly set the allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // allowed methods
  credentials: true, // allow cookies and credentials
}));

// Middleware to handle JSON requests
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));  // Make sure 'uploads' folder is accessible

// Define the routes
app.use('/', AdminRouter);  // Admin routes for handling file uploads
app.use('/auth', employeeRouter);  // Employee routes for other functionalities

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
