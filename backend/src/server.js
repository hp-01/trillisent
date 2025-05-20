// assessment-backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Make sure you've installed it: npm install cors

const questionRoutes = require('./routes/questionRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
// ... potentially other routes

const app = express();
const PORT = process.env.PORT || 5001;

// --- CORS Configuration ---
const allowedOrigins = [
    process.env.FRONTEND_URL,
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Specify allowed headers
    credentials: true // If you need to send cookies or authorization headers
};

app.use(cors(corsOptions));
// Alternatively, for simpler "allow all" during development (NOT recommended for production):
// app.use(cors());

// --- End CORS Configuration ---


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
// ... (your DB connection logic) ...

// Routes
app.get('/', (req, res) => {
    res.send('Assessment Backend API is running!');
});

app.use('/api/questions', questionRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);
// ...

// Not Found and Error Handlers
// ...

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Allowed frontend origin: ${process.env.FRONTEND_URL}`); // Log your frontend URL
});