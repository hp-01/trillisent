const express = require('express');
const router = express.Router();
const { submitAssessment, getSubmissionStatus } = require('../controllers/assessmentController');

// Submit assessment
router.post('/submit', submitAssessment);

// Add a route to check submission status for a userId
router.get('/status/:userId', getSubmissionStatus);
module.exports = router;