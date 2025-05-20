const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    selectedOption: {
        type: String, // The text of the selected option
        required: false, // User might not answer all questions
    },
    isCorrect: { // For easier analysis later
        type: Boolean,
        required: false
    }
}, { _id: false }); // Don't create an _id for subdocuments

const userResponseSchema = new mongoose.Schema({
    userId: { // Could be a name, email, or a generated ID
        type: String,
        required: [true, 'User identifier is required'],
        // unique: true, // Add if one user can only submit once, enforced by controller logic
    },
    answers: [answerSchema],
    score: {
        type: Number,
        required: true,
        min: 0,
    },
    totalQuestions: {
        type: Number,
        required: true,
    },
    timeTaken: { // in seconds
        type: Number,
        required: false,
    },
    status: {
        type: String,
        enum: ['completed', 'timed-out', 'in-progress'], // 'in-progress' might not be stored
        default: 'completed',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

module.exports = mongoose.model('UserResponse', userResponseSchema);