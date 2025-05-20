// src/pages/student/StudentEntryPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../../context/AssessmentContext';
import { checkUserSubmissionStatus } from '../../services/api'; // Import the new API service
import './StudentEntryPage.css';

function StudentEntryPage() {
    const [tempUserId, setTempUserId] = useState('');
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [entryError, setEntryError] = useState(''); // For errors on this page

    const {
        startAssessment,
        userId: contextUserId, // The ID currently active in the context (if any)
        isAssessmentStarted,   // Is an assessment flow (questions, timer) active in context?
        isAssessmentSubmitted, // Was the *context's* assessment flow submitted?
        resetAssessmentContextState,
        // hasSubmittedBefore from context is less relevant here, as we're doing a fresh API check
    } = useAssessment();
    const navigate = useNavigate();

    useEffect(() => {
        // This useEffect is for handling page reloads or navigating back to entry page
        // console.log("StudentEntryPage useEffect (initial load/nav back):", { contextUserId, isAssessmentStarted, isAssessmentSubmitted });

        if (isAssessmentStarted && contextUserId && !isAssessmentSubmitted) {
            // If an assessment is active in context (e.g., user refreshed /assessment then navigated back here)
            // and it wasn't submitted, let them continue.
            // console.log("StudentEntryPage: Active (but not submitted) assessment found, redirecting to /assessment");
            navigate('/assessment');
        } else {
            // If no active assessment in context, or if previous context assessment WAS submitted,
            // ensure a clean slate for new entry.
            // console.log("StudentEntryPage: No active assessment or previous was submitted. Resetting context.");
            resetAssessmentContextState();
            localStorage.removeItem('assessmentUserId'); // Clear any stale ID from previous session
        }
        // Clear any local entry error when component mounts or relevant context state changes
        setEntryError('');
    }, [isAssessmentStarted, isAssessmentSubmitted, contextUserId, navigate, resetAssessmentContextState]);


    const handleStartAttempt = async () => {
        const trimmedUserId = tempUserId.trim();
        if (!trimmedUserId) {
            setEntryError("Please enter your Name or ID.");
            return;
        }

        setIsCheckingStatus(true);
        setEntryError(''); // Clear previous errors

        try {
            // console.log("StudentEntryPage: Checking submission status for:", trimmedUserId);
            const response = await checkUserSubmissionStatus(trimmedUserId);
            // console.log("StudentEntryPage: Status check response:", response.data);

            if (response.data.hasSubmitted) {
                setEntryError(response.data.message || `The ID "${trimmedUserId}" has already completed this assessment.`);
                setIsCheckingStatus(false);
            } else {
                // User has NOT submitted, proceed to start the assessment in the context
                // console.log("StudentEntryPage: User has not submitted. Calling startAssessment.");
                // startAssessment will reset relevant context states for a fresh start
                startAssessment(trimmedUserId);
                // Navigation to /assessment is handled by startAssessment
            }
        } catch (error) {
            // console.error("StudentEntryPage: Error checking submission status:", error);
            setEntryError(error.response?.data?.message || "Could not verify submission status. Please try again.");
            setIsCheckingStatus(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleStartAttempt();
    };

    return (
        <div className="student-entry-container">
            <h2>Welcome to the Assessment</h2>
            <p>Please enter your Name or Student ID to begin.</p>

            {entryError && (
                <p className="error-message-reattempt">{entryError}</p>
            )}

            <form onSubmit={handleSubmit} className="student-entry-form">
                <input
                    type="text"
                    value={tempUserId}
                    onChange={(e) => {
                        setTempUserId(e.target.value);
                        if (entryError) setEntryError(''); // Clear error when user types
                    }}
                    placeholder="Enter Your Name/ID"
                    required
                    disabled={isCheckingStatus}
                    className="student-entry-input"
                />
                <button
                    type="submit"
                    disabled={isCheckingStatus}
                    className="student-entry-button"
                >
                    {isCheckingStatus ? 'Checking...' : 'Start Assessment'}
                </button>
            </form>
            <Link to="/admin" className="btn btn-secondary" style={{marginTop: '20px'}}>Admin Panel</Link>
        </div>
    );
}

export default StudentEntryPage;