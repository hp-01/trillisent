const Question = require('../models/Question');

// @desc    Get all questions (without correct answers)
// @route   GET /api/questions
// @access  Public
exports.getQuestions = async (req, res) => {
    try {
        // Fetch questions but exclude the correctAnswer field for the student view
        const questions = await Question.find().select('-correctAnswer');
        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: 'No questions found' });
        }
        // Ensure 10 questions are returned as per requirement, or handle if less/more
        // For now, assumes DB has the 10 questions.
        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error while fetching questions', error: error.message });
    }
};

// (Optional) Admin: Add a new question - NOT REQUIRED BY SPEC but useful
exports.addQuestion = async (req, res) => {
    try {
        const { questionText, options, correctAnswer } = req.body;

        if (!questionText || !options || !correctAnswer) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (options.length !== 4) {
            return res.status(400).json({ message: 'A question must have exactly 4 options' });
        }
        if (!options.includes(correctAnswer)) {
            return res.status(400).json({ message: 'Correct answer must be one of the provided options' });
        }

        const newQuestion = new Question({ questionText, options, correctAnswer });
        await newQuestion.save();
        res.status(201).json({ message: 'Question added successfully', question: newQuestion });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({ message: 'Server error while adding question', error: error.message });
    }
};