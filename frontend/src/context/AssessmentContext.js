import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchQuestions as apiFetchQuestions, submitAssessment as apiSubmitAssessment } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AssessmentContext = createContext();

export const useAssessment = () => useContext(AssessmentContext);

export const AssessmentProvider = ({ children }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [questionStatus, setQuestionStatus] = useState({});
    const [timer, setTimer] = useState(60 * 60);
    const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
    const [isAssessmentSubmitted, setIsAssessmentSubmitted] = useState(false);
    const [submissionResult, setSubmissionResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userId, setUserIdState] = useState(() => localStorage.getItem('assessmentUserId') || '');

    const navigate = useNavigate();

    const initializeQuestionStatus = useCallback((qs) => {
        // console.log("Context: Initializing question status for", qs.length, "questions");
        const initialStatus = {};
        qs.forEach(q => {
            initialStatus[q._id] = 'not-visited';
        });
        setQuestionStatus(initialStatus);
    }, []);

    const updateQuestionStatusToVisited = useCallback((questionId) => {
        // console.log("Context: Updating status to visited for QID:", questionId);
        setQuestionStatus(prevStatus => {
            if (prevStatus[questionId] === 'not-visited') {
                return { ...prevStatus, [questionId]: 'visited' };
            }
            return prevStatus;
        });
    }, []);

    const fetchQuestionsAndSetup = useCallback(async () => {
        if (!userId) {
            // console.log("Context: fetchQuestionsAndSetup - No userId, aborting.");
            // setError("User ID is missing. Cannot fetch questions."); // Optional: set an error
            navigate('/'); // Should not happen if called correctly
            return;
        }
        // console.log("Context: fetchQuestionsAndSetup - Called for userId:", userId);
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiFetchQuestions();
            // console.log("Context: fetchQuestionsAndSetup - API Response Status:", response.status);
            // console.log("Context: fetchQuestionsAndSetup - API Response Data:", response.data);
            const fetchedQuestions = response.data;

            if (fetchedQuestions && fetchedQuestions.length > 0) {
                // console.log("Context: fetchQuestionsAndSetup - Questions received:", fetchedQuestions.length);
                setQuestions(fetchedQuestions);
                initializeQuestionStatus(fetchedQuestions);
                setUserAnswers({});
                // setIsAssessmentSubmitted(false); // Should be handled by reset or start
                // setSubmissionResult(null);
                setTimer(60 * 60);
                setCurrentQuestionIndex(0);
                if (fetchedQuestions[0]?._id) {
                    updateQuestionStatusToVisited(fetchedQuestions[0]._id);
                }
            } else {
                // console.log("Context: fetchQuestionsAndSetup - No questions in response or empty array.");
                setError("No questions found for the assessment. Please check with the administrator.");
                setQuestions([]);
            }
        } catch (err) {
            // console.error("Context: fetchQuestionsAndSetup - API Error:", err);
            // console.error("Context: fetchQuestionsAndSetup - Error response data:", err.response?.data);
            setError(err.response?.data?.message || 'Failed to fetch questions. Please try again.');
            setQuestions([]);
        } finally {
            // console.log("Context: fetchQuestionsAndSetup - Setting isLoading to false.");
            setIsLoading(false);
        }
    }, [userId, navigate, initializeQuestionStatus, updateQuestionStatusToVisited]);

    const startAssessment = useCallback((id) => {
        // console.log("Context: startAssessment - User ID:", id);
        setUserIdState(id);
        localStorage.setItem('assessmentUserId', id);
        setIsAssessmentStarted(true);
        setIsAssessmentSubmitted(false); // Ensure previous submission state is cleared
        setSubmissionResult(null);     // Clear previous results
        setQuestions([]);               // Clear previous questions before fetching new ones
        setCurrentQuestionIndex(0);     // Reset index
        setUserAnswers({});             // Reset answers
        setQuestionStatus({});          // Reset statuses
        setError(null);                 // Clear previous errors
        // fetchQuestionsAndSetup will be called by AssessmentPage's useEffect
        navigate('/assessment');
    }, [navigate]);

    const selectAnswer = useCallback((questionId, selectedOption) => {
        setUserAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
        setQuestionStatus(prevStatus => ({ ...prevStatus, [questionId]: 'answered' }));
    }, []);

    const nextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            const nextIdx = currentQuestionIndex + 1;
            if (questions[nextIdx]?._id) {
                updateQuestionStatusToVisited(questions[nextIdx]._id);
            }
            setCurrentQuestionIndex(nextIdx);
        }
    }, [currentQuestionIndex, questions, updateQuestionStatusToVisited]);

    const prevQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            const prevIdx = currentQuestionIndex - 1;
            if (questions[prevIdx]?._id) {
                updateQuestionStatusToVisited(questions[prevIdx]._id);
            }
            setCurrentQuestionIndex(prevIdx);
        }
    }, [currentQuestionIndex, questions, updateQuestionStatusToVisited]);

    const jumpToQuestion = useCallback((index) => {
        if (index >= 0 && index < questions.length) {
            if (questions[index]?._id) {
                updateQuestionStatusToVisited(questions[index]._id);
            }
            setCurrentQuestionIndex(index);
        }
    }, [questions, updateQuestionStatusToVisited]);

    const submitAssessment = useCallback(async (submissionStatus = 'completed') => {
        if (isAssessmentSubmitted) return;
        // console.log("Context: submitAssessment - Submitting for userId:", userId);
        setIsLoading(true);
        setError(null);
        const answersToSubmit = questions.map(q => ({
            questionId: q._id,
            selectedOption: userAnswers[q._id] || null
        }));

        try {
            const response = await apiSubmitAssessment({
                userId,
                answers: answersToSubmit,
                timeTaken: (60 * 60) - timer,
                status: submissionStatus
            });
            setSubmissionResult(response.data);
            setIsAssessmentSubmitted(true);
            localStorage.removeItem('assessmentUserId'); // Clear after successful submission
            navigate('/assessment/result');
        } catch (err) {
            // console.error("Context: submitAssessment - API Error:", err);
            setError(err.response?.data?.message || 'Failed to submit assessment.');
            if (err.response?.status === 403) { // Already submitted
                setSubmissionResult({ message: err.response.data.message, score: err.response.data.score, totalQuestions: err.response.data.totalQuestions });
                setIsAssessmentSubmitted(true);
                navigate('/assessment/result');
            }
        } finally {
            setIsLoading(false);
        }
    }, [userId, questions, userAnswers, timer, navigate, isAssessmentSubmitted]);

    useEffect(() => {
        let interval;
        if (isAssessmentStarted && !isAssessmentSubmitted && timer > 0) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && isAssessmentStarted && !isAssessmentSubmitted) {
            // console.log("Context: Timer expired, auto-submitting.");
            submitAssessment('timed-out');
        }
        return () => clearInterval(interval);
    }, [isAssessmentStarted, isAssessmentSubmitted, timer, submitAssessment]);

    const resetAssessmentContextState = useCallback(() => { // Renamed for clarity
        // console.log("Context: resetAssessmentContextState - Resetting context state");
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setQuestionStatus({});
        setTimer(60 * 60);
        setIsAssessmentStarted(false);
        setIsAssessmentSubmitted(false);
        setSubmissionResult(null);
        // Don't clear userId from localStorage here, StudentEntryPage handles initial load
        // setUserIdState(''); // This might be too aggressive if user just navigates away and back
        setIsLoading(false);
        setError(null);
    }, []);

    return (
        <AssessmentContext.Provider value={{
            userId,
            questions,
            currentQuestionIndex,
            userAnswers,
            questionStatus,
            timer,
            isAssessmentStarted,
            isAssessmentSubmitted,
            submissionResult,
            isLoading,
            error,
            fetchQuestionsAndSetup,
            startAssessment,
            selectAnswer,
            nextQuestion,
            prevQuestion,
            jumpToQuestion,
            submitAssessment,
            resetAssessmentContextState
        }}>
            {children}
        </AssessmentContext.Provider>
    );
};