import React from 'react';
import { Link } from 'react-router-dom';

function SubmissionItem({ submission }) {
    return (
        <tr>
            <td>{submission.userId}</td>
            <td>{submission.score} / {submission.totalQuestions}</td>
            <td>{submission.status}</td>
            <td>{new Date(submission.submittedAt).toLocaleString()}</td>
            <td>
                <Link to={`/admin/submission/${submission._id}`} className="btn btn-sm btn-info">
                    View Details
                </Link>
            </td>
        </tr>
    );
}

export default SubmissionItem;