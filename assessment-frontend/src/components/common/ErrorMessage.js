import React from 'react';
import './ErrorMessage.css';

function ErrorMessage({ message }) {
    if (!message) return null;
    return (
        <div className="error-message-container">
            <p>Error: {message}</p>
        </div>
    );
}
export default ErrorMessage;