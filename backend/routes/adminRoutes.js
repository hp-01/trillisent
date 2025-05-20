const express = require('express');
const router = express.Router();
const { getAllSubmissions, getSubmissionDetails } = require('../controllers/adminController');

// Get all submissions (summary)
router.get('/submissions', getAllSubmissions);

// Get detailed view of a specific submission
router.get('/submissions/:submissionId', getSubmissionDetails);

module.exports = router;