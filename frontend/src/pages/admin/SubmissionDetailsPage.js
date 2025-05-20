import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdminSubmissionDetails } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './SubmissionDetailsPage.css';

function SubmissionDetailsPage() {
    const { submissionId } = useParams();
    const [submission, setSubmission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getAdminSubmissionDetails(submissionId);
                setSubmission(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch submission details.');
                console.error("Fetch details error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [submissionId]);

    if (isLoading) return <LoadingSpinner message="Loading submission details..." />;
    if (error) return <ErrorMessage message={error} />;
    if (!submission) return <p>Submission not found.</p>;

    return (
        <div className="submission-details-container">
            <h2>Submission Details</h2>
            <Link to="/admin" className="btn btn-secondary" style={{marginBottom: '20px', display: 'inline-block'}}>Back to Dashboard</Link>
            <p><strong>User ID:</strong> {submission.userId}</p>
            <p><strong>Score:</strong> {submission.score} / {submission.totalQuestions}</p>
            <p><strong>Status:</strong> {submission.status}</p>
            <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
            {submission.timeTaken && <p><strong>Time Taken:</strong> {Math.floor(submission.timeTaken / 60)}m {submission.timeTaken % 60}s</p>}

            <h3>Answers:</h3>
            <ul className="answers-list-admin">
                {submission.answers.map((ans, index) => (
                    <li key={ans.questionId?._id || index} className={`answer-item-admin ${ans.isCorrect ? 'correct' : (ans.selectedOption ? 'incorrect' : 'unanswered')}`}>
                        <h4>Q{index + 1}: {ans.questionId?.questionText || 'Question text not available'}</h4>
                        <p><strong>Options:</strong></p>
                        <ul className="options-list-admin">
                            {ans.questionId?.options.map((opt, i) => (
                                <li key={i}
                                    className={`
                                        ${opt === ans.selectedOption ? 'selected-option' : ''}
                                        ${opt === ans.questionId?.correctAnswer ? 'correct-answer-option' : ''}
                                    `}
                                >
                                    {opt}
                                    {opt === ans.selectedOption && <span> (Your Answer)</span>}
                                    {opt === ans.questionId?.correctAnswer && <span className="correct-tick"> ✔ (Correct)</span>}
                                </li>
                            ))}
                        </ul>
                        <p><strong>Your Answer:</strong> {ans.selectedOption || <span className="unanswered-text">Not Answered</span>}</p>
                        <p><strong>Correct Answer:</strong> {ans.questionId?.correctAnswer}</p>
                        <p><strong>Result:</strong> {ans.isCorrect ? 'Correct' : (ans.selectedOption ? 'Incorrect' : 'Unanswered')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SubmissionDetailsPage;