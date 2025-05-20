const UserResponse = require('../models/UserResponse');
const Question = require('../models/Question'); // To potentially enrich response details

// @desc    Get all user submissions (summary)
// @route   GET /api/admin/submissions
// @access  Protected (in a real app, add auth middleware)
exports.getAllSubmissions = async (req, res) => {
    try {
        // Fetch necessary fields for the list view
        const submissions = await UserResponse.find()
            .select('userId score totalQuestions submittedAt status')
            .sort({ submittedAt: -1 }); // Sort by most recent

        if (!submissions || submissions.length === 0) {
            return res.status(404).json({ message: 'No submissions found' });
        }

        res.status(200).json(submissions);
    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({ message: 'Server error while fetching submissions', error: error.message });
    }
};

// @desc    Get a specific user submission with detailed answers
// @route   GET /api/admin/submissions/:submissionId
// @access  Protected
exports.getSubmissionDetails = async (req, res) => {
    try {
        const submissionId = req.params.submissionId;
        const submission = await UserResponse.findById(submissionId).populate({
            path: 'answers.questionId', // Populate the question details for each answer
            model: 'Question',
            select: 'questionText options correctAnswer' // Select fields you want from Question model
        });

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // The score is already calculated and stored, so no need to recalculate here.
        // `submission.answers` will now have `questionId` populated with question details.

        res.status(200).json(submission);
    } catch (error) {
        console.error('Error fetching submission details:', error);
        res.status(500).json({ message: 'Server error while fetching submission details', error: error.message });
    }
};