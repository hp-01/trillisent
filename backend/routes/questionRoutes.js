const express = require('express');
const router = express.Router();
const { getQuestions, addQuestion } = require('../controllers/questionController');

// Get all questions for student assessment (correct answers excluded by controller)
router.get('/', getQuestions);

// (Optional) POST a new question - for admin/setup, not for students
// In a real app, this would be protected.
// router.post('/', addQuestion);

module.exports = router;