import React from 'react';
import './NavigationButtons.css';

function NavigationButtons({ onPrev, onNext, onSubmit, isFirst, isLast, totalQuestions, currentQuestionNumber }) {
    return (
        <div className="navigation-buttons-container">
            <button onClick={onPrev} disabled={isFirst} className="nav-button prev-button">
                Previous
            </button>
            <span className="question-counter">
                Question {currentQuestionNumber} of {totalQuestions}
            </span>
            {isLast ? (
                <button onClick={onSubmit} className="nav-button submit-button">
                    Submit
                </button>
            ) : (
                <button onClick={onNext} disabled={isLast} className="nav-button next-button">
                    Next
                </button>
            )}
        </div>
    );
}

export default NavigationButtons;