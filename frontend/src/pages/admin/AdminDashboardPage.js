import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminSubmissions } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SubmissionItem from '../../components/admin/SubmissionItem';
import './AdminDashboardPage.css';

function AdminDashboardPage() {
    const [submissions, setSubmissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubmissions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getAdminSubmissions();
                setSubmissions(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch submissions.');
                console.error("Fetch submissions error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSubmissions();
    }, []);

    if (isLoading) return <LoadingSpinner message="Loading submissions..." />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="admin-dashboard-container">
            <h2>Admin Dashboard - Submissions</h2>
            <Link to="/" className="btn btn-secondary" style={{marginBottom: '20px', display: 'inline-block'}}>Back to Student Entry</Link>
            {submissions.length === 0 ? (
                <p>No submissions found.</p>
            ) : (
                <table className="submissions-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Score</th>
                            <th>Total Questions</th>
                            <th>Status</th>
                            <th>Submitted At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submissions.map(sub => (
                            <SubmissionItem key={sub._id} submission={sub} />
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminDashboardPage;