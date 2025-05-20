import React from 'react';
import './QuestionDisplay.css';

function QuestionDisplay({ question, selectedOption, onSelectOption }) {
    if (!question) {
        return <p>Loading question...</p>;
    }

    return (
        <div className="question-display-container">
            <h3 className="question-text">Q: {question.questionText}</h3>
            <ul className="options-list">
                {question.options.map((option, index) => (
                    <li key={index} className="option-item">
                        <label>
                            <input
                                type="radio"
                                name={`question-${question._id}`}
                                value={option}
                                checked={selectedOption === option}
                                onChange={() => onSelectOption(option)}
                                className="option-radio"
                            />
                            <span className="option-text">{option}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default QuestionDisplay;