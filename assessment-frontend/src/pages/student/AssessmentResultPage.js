import React from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import { Link } from 'react-router-dom';
import './AssessmentResultPage.css';

function AssessmentResultPage() {
    const { submissionResult, resetAssessmentContextState } = useAssessment();

    if (!submissionResult) {
        return (
            <div className="assessment-result-container">
                <p>No submission result found. You might need to complete the assessment first.</p>
                <Link to="/" onClick={resetAssessmentContextState} className="btn btn-primary">Go to Home</Link>
            </div>
        );
    }
    // Ensure totalQuestions is available, fallback if needed
    const totalQuestions = submissionResult.totalQuestions || (submissionResult.answers ? submissionResult.answers.length : 'N/A');

    return (
        <div className="assessment-result-container">
            <h2>Assessment Completed!</h2>
            {submissionResult.message && <p className="submission-message">{submissionResult.message}</p>}
            {typeof submissionResult.score !== 'undefined' && (
                <p className="submission-score">
                    Your Score: {submissionResult.score} / {totalQuestions}
                </p>
            )}
            <p>Thank you for taking the assessment.</p>
            <Link to="/" onClick={resetAssessmentContextState} className="btn btn-primary">
                Start New Assessment
            </Link>
            <br/>
            <Link to="/admin" className="btn btn-secondary" style={{marginTop: '10px'}}>
                View Admin Dashboard
            </Link>
        </div>
    );
}

export default AssessmentResultPage;