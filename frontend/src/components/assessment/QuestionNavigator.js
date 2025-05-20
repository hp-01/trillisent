import React from 'react';
import './QuestionNavigator.css';

function QuestionNavigator({ questions, currentQuestionIndex, questionStatus, onJumpToQuestion }) {
    const getStatusClass = (qId) => {
        const status = questionStatus[qId];
        if (status === 'answered') return 'answered';
        if (status === 'visited') return 'visited-not-answered';
        return 'not-visited'; // Default or 'not-visited'
    };

    return (
        <div className="question-navigator-container">
            <h4>Question Navigator</h4>
            <div className="navigator-grid">
                {questions.map((q, index) => (
                    <button
                        key={q._id}
                        onClick={() => onJumpToQuestion(index)}
                        className={`navigator-item ${getStatusClass(q._id)} ${index === currentQuestionIndex ? 'current' : ''}`}
                        aria-label={`Go to question ${index + 1}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div className="navigator-legend">
                 <p><span className="legend-color answered"></span> Answered</p>
                 <p><span className="legend-color visited-not-answered"></span> Visited</p>
                 <p><span className="legend-color not-visited"></span> Not Visited</p>
            </div>
        </div>
    );
}

export default QuestionNavigator;