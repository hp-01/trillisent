require('dotenv').config({ path: '../.env' }); // Adjust path if script is run from root
const mongoose = require('mongoose');
const Question = require('../models/Question');

const sampleQuestions = [
    {
        questionText: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        questionText: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correctAnswer: "Mars"
    },
    {
        questionText: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: "Pacific"
    },
    {
        questionText: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "Leo Tolstoy", "Mark Twain"],
        correctAnswer: "William Shakespeare"
    },
    {
        questionText: "What is the chemical symbol for water?",
        options: ["O2", "H2O", "CO2", "NaCl"],
        correctAnswer: "H2O"
    },
    {
        questionText: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7"
    },
    {
        questionText: "What is the square root of 64?",
        options: ["6", "7", "8", "9"],
        correctAnswer: "8"
    },
    {
        questionText: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
        correctAnswer: "Carbon Dioxide"
    },
    {
        questionText: "What is the currency of Japan?",
        options: ["Won", "Yuan", "Yen", "Dollar"],
        correctAnswer: "Yen"
    },
    {
        questionText: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
        correctAnswer: "Leonardo da Vinci"
    }
    // Add up to 10 questions
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected for seeding...');

        await Question.deleteMany({}); // Clear existing questions
        console.log('Old questions deleted.');

        await Question.insertMany(sampleQuestions);
        console.log(`${sampleQuestions.length} questions seeded successfully!`);

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        mongoose.disconnect();
        console.log('MongoDB disconnected.');
    }
};

// Run the seeder
seedDB();