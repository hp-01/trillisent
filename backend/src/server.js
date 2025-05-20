// assessment-backend/server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure 'cors' is installed: npm install cors

const questionRoutes = require('./routes/questionRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
// ... any other route imports

const app = express();
const PORT = process.env.PORT || 5001; // Default to 5001 if not in .env

// --- CORS Configuration ---
const VERCEL_FRONTEND_URL = 'https://trillisent.vercel.app'; // Your deployed Vercel frontend
const LOCAL_FRONTEND_URL_3000 = 'http://localhost:3000';   // Common local React dev port
const LOCAL_FRONTEND_URL_3001 = 'http://localhost:3001';   // Another common local port (Vite default sometimes)
const LOCAL_FRONTEND_URL_5173 = 'http://localhost:5173';

const allowedOrigins = [
    VERCEL_FRONTEND_URL,
    LOCAL_FRONTEND_URL_3000,
    LOCAL_FRONTEND_URL_3001,
    LOCAL_FRONTEND_URL_5173
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            const msg = `CORS Error: The origin '${origin}' is not allowed by the CORS policy. Allowed origins: ${allowedOrigins.join(', ')}`;
            console.error(msg); // Log this on your backend to see what's being denied
            callback(new Error(msg)); // This error will be passed to Express error handler if needed
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed request headers
    credentials: true // Important if your frontend needs to send cookies or Authorization headers
};

// Apply CORS middleware to all routes
// This MUST be before your route definitions
app.use(cors(corsOptions));
// --- End CORS Configuration ---


// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit if DB connection fails
    });

// API Routes
app.get('/api', (req, res) => { // Simple test route for the API base
    res.json({ message: 'Assessment Backend API is running!' });
});
app.use('/api/questions', questionRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);

// Not Found Handler (after all routes)
app.use((req, res, next) => {
    res.status(404).json({ message: "Resource not found on this server" });
});

// Global Error Handler (last piece of middleware)
app.use((err, req, res, next) => {
    console.error("Global Error Handler Caught:", err.message);
    console.error(err.stack);
    // If it's a CORS error we generated, it will have a message.
    if (err.message.startsWith('CORS Error:')) {
        return res.status(403).json({ message: err.message }); // 403 Forbidden for CORS denial
    }
    res.status(err.status || 500).send({
        message: err.message || 'An unexpected server error occurred.',
        // Only show full error details in development
        error: process.env.NODE_ENV === 'development' ? err.toString() : {}
    });
});

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
    console.log(`CORS enabled. Allowed origins: ${allowedOrigins.join(', ')}`);
    if (process.env.MONGODB_URI) {
        console.log("Attempting to connect to MongoDB...");
    } else {
        console.error("Error: MONGODB_URI environment variable is not set!");
    }
});