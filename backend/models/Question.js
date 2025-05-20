const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    // Using default _id as unique identifier, but can add a custom one if needed
    // customId: { type: String, unique: true, required: false }, // e.g., "q1", "q2"
    questionText: {
        type: String,
        required: [true, 'Question text is required'],
    },
    options: {
        type: [String],
        required: [true, 'Options are required'],
        validate: [
            (val) => val.length === 4,
            'A question must have exactly 4 options',
        ],
    },
    correctAnswer: {
        type: String, // Storing the text of the correct option
        required: [true, 'Correct answer is required'],
        // Could also store index, but text is often easier to manage in admin/seed
    },
}, { timestamps: true });

// Ensure correctAnswer is one of the options (can be complex, usually handled at application level during creation)
// questionSchema.pre('save', function(next) {
//     if (this.options && this.correctAnswer && !this.options.includes(this.correctAnswer)) {
//         return next(new Error('Correct answer must be one of the provided options.'));
//     }
//     next();
// });

module.exports = mongoose.model('Question', questionSchema);