# MERN Stack Assessment Application

This is a full-stack assessment application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It includes a student panel for taking a multiple-choice quiz and an admin panel for viewing submissions and scores.

This repository contains two main projects:
*   `backend/`: The Node.js, Express.js, and MongoDB backend API.
*   `frontend/`: The React.js frontend application.

## Features

**Student Panel:**
*   Take a 10-question multiple-choice assessment.
*   Questions rendered one at a time with Previous/Next navigation.
*   Question Navigator Matrix (1-10) for direct question access.
*   Color indicators for question status (Not Visited, Visited & Unanswered, Answered).
*   60-minute countdown timer.
*   Ability to submit the test at any time.
*   Prevention of re-attempts after submission.
*   View score upon completion.

**Admin Panel:**
*   View a list of all users who completed the assessment.
*   See each candidate's selected answers and their final score.

## Tech Stack

*   **Frontend:** React.js, React Router, Axios, CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Deployment Platforms:**
    *   Frontend: Vercel
    *   Backend: Render

## Project Structure Overview


## Prerequisites

*   Node.js (v16.x or later recommended)
*   npm (v8.x or later) or Yarn
*   MongoDB (A local instance or a MongoDB Atlas account)
*   Git

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/mern-assessment-app.git # Replace with your repo URL
cd mern-assessment-app

cd assessment-backend
npm install
# or
# yarn install
npm run seed
cd assessment-frontend
# If you were in assessment-backend, you might do: cd ../assessment-frontend
npm install
# or
# yarn install


cd assessment-backend
npm run dev

cd assessment-frontend
npm start # For Create React App
# or
# npm run dev # For Vite


# Example: assessment-backend/.env
PORT=5001
MONGODB_URI="mongodb+srv://<YOUR_USERNAME>:<YOUR_PASSWORD>@<YOUR_CLUSTER_URL>/<YOUR_DB_NAME>?retryWrites=true&w=majority"
# NODE_ENV=development # Optional, can be set for specific behaviors

# For local development, if your backend's CORS config needs to know the local frontend URL explicitly
# (though the provided server.js hardcodes common local origins)
# LOCAL_DEV_FRONTEND_URL=http://localhost:3000

# For deployed backend on Render, this should be set in Render's environment variables
# DEPLOYED_FRONTEND_URL=https://trillisent.vercel.app

# Example: assessment-frontend/.env

# For Create React App:
REACT_APP_API_BASE_URL=http://localhost:5001/api

# For Vite:
# VITE_API_BASE_URL=http://localhost:5001/api