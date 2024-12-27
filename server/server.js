import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';

const app = express();

// CORS configuration to allow credentials and specific origin
app.use(cors({
    origin: "http://localhost:5173", // explicitly set the allowed origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // allowed methods
    credentials: true, // allow cookies and credentials
}));

app.use(express.json());

// Define the routes
app.use('/auth', adminRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
