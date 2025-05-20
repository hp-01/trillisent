// assessment-backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// const cors = require('cors'); // REMOVED

const questionRoutes = require('./routes/questionRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// NO app.use(cors(...)); line here

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Routes
app.get('/', (req, res) => {
    res.send('Assessment Backend API is running!');
});

app.use('/api/questions', questionRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/admin', adminRoutes);

// Not Found Handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Resource not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send({
        message: err.message || 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. CORS is NOT enabled for cross-origin requests.`);
});