import React, { useState, useEffect } from 'react';
import './Timer.css';

function Timer({ initialTime, onTimeout, isSubmitted }) {
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        setTimeLeft(initialTime); // Reset time if initialTime changes (e.g. on new assessment start)
    }, [initialTime]);

    useEffect(() => {
        if (isSubmitted || timeLeft <= 0) {
            if (timeLeft <= 0 && !isSubmitted) {
                onTimeout();
            }
            return;
        }

        const intervalId = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft, onTimeout, isSubmitted]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="timer-container">
            <h3>Time Left</h3>
            <div className={`timer-display ${timeLeft <= 60 ? 'timer-low' : ''}`}>
                {formatTime(timeLeft)}
            </div>
        </div>
    );
}

export default Timer;