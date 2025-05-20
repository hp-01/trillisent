const UserResponse = require('../models/UserResponse');
const Question = require('../models/Question');

// @desc    Submit assessment answers
// @route   POST /api/assessment/submit
// @access  Public (assuming user identified by userId in body)

exports.getSubmissionStatus = async (req, res, next) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const existingSubmission = await UserResponse.findOne({ userId }).select('_id'); // Only need to know if it exists

        if (existingSubmission) {
            res.status(200).json({ hasSubmitted: true, message: 'This user ID has already completed the assessment.' });
        } else {
            res.status(200).json({ hasSubmitted: false });
        }
    } catch (error) {
        next(error); // Pass error to global error handler
    }
};


exports.submitAssessment = async (req, res) => {
    try {
        const { userId, answers: studentAnswers, timeTaken, status = 'completed' } = req.body;

        if (!userId || !studentAnswers) {
            return res.status(400).json({ message: 'User ID and answers are required' });
        }

        // Prevent re-attempts (basic check, can be enhanced)
        const existingSubmission = await UserResponse.findOne({ userId });
        if (existingSubmission) {
            // Allow re-submission if a different policy is desired, e.g. for 'timed-out' that wasn't fully submitted
            // For now, strictly prevent multiple submissions for the same userId
            return res.status(403).json({ message: 'Assessment already submitted for this user.' });
        }

        // Fetch all questions with correct answers from DB
        const questionsFromDB = await Question.find().lean(); // .lean() for plain JS objects
        if (!questionsFromDB || questionsFromDB.length === 0) {
            return res.status(500).json({ message: 'No questions found in database to evaluate.' });
        }

        let score = 0;
        const processedAnswers = [];
        const totalQuestions = questionsFromDB.length;

        for (const studentAnswer of studentAnswers) {
            const question = questionsFromDB.find(q => q._id.toString() === studentAnswer.questionId);
            if (question) {
                const isCorrect = studentAnswer.selectedOption === question.correctAnswer;
                if (isCorrect) {
                    score++;
                }
                processedAnswers.push({
                    questionId: question._id,
                    selectedOption: studentAnswer.selectedOption,
                    isCorrect: isCorrect,
                });
            } else {
                // Handle case where a submitted questionId doesn't exist (should not happen with a good frontend)
                console.warn(`Warning: Submitted answer for non-existent questionId ${studentAnswer.questionId}`);
                processedAnswers.push({
                    questionId: studentAnswer.questionId, // Keep original ID for logging
                    selectedOption: studentAnswer.selectedOption,
                    isCorrect: false, // Mark as incorrect if question not found
                });
            }
        }

        const newUserResponse = new UserResponse({
            userId,
            answers: processedAnswers,
            score,
            totalQuestions,
            timeTaken: timeTaken || 0, // timeTaken might be sent from frontend
            status, // 'completed' or 'timed-out'
        });

        await newUserResponse.save();

        res.status(201).json({
            message: 'Assessment submitted successfully',
            submissionId: newUserResponse._id,
            userId: newUserResponse.userId,
            score: newUserResponse.score,
            totalQuestions: newUserResponse.totalQuestions,
        });

    } catch (error) {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ message: 'Server error while submitting assessment', error: error.message });
    }
};