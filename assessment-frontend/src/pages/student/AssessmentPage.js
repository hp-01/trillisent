import React, { useEffect } from 'react';
import { useAssessment } from '../../context/AssessmentContext';
import QuestionDisplay from '../../components/assessment/QuestionDisplay';
import NavigationButtons from '../../components/assessment/NavigationButtons';
import QuestionNavigator from '../../components/assessment/QuestionNavigator';
import Timer from '../../components/assessment/Timer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import './AssessmentPage.css';

function AssessmentPage() {
    const {
        questions,
        currentQuestionIndex,
        userAnswers,
        questionStatus,
        timer,
        isLoading,
        error,
        fetchQuestionsAndSetup, // Use the renamed function
        isAssessmentStarted,
        userId, // Get userId to ensure it's set before fetching
        selectAnswer,
        nextQuestion,
        prevQuestion,
        jumpToQuestion,
        submitAssessment,
        isAssessmentSubmitted,
    } = useAssessment();

    useEffect(() => {
        // console.log("AssessmentPage useEffect Triggered:", { isAssessmentStarted, userId, questionsLength: questions.length, isLoading, error });
        // Only fetch if assessment has started, userId is present, questions are not yet loaded,
        // and not currently loading or in an error state (to prevent multiple calls).
        if (isAssessmentStarted && userId && questions.length === 0 && !isLoading && !error) {
            // console.log("AssessmentPage: Conditions met, calling fetchQuestionsAndSetup()");
            fetchQuestionsAndSetup();
        }
    }, [isAssessmentStarted, userId, questions.length, isLoading, error, fetchQuestionsAndSetup]);


    if (isLoading && questions.length === 0) return <LoadingSpinner message="Loading questions..." />;
    if (error) return <ErrorMessage message={error} />; // Display specific error from context

    // These checks should ideally be handled by ProtectedAssessmentRoute, but as a safeguard:
    if (!isAssessmentStarted || !userId) return <p>Assessment not properly started. Please return to the home page.</p>;
    if (isAssessmentSubmitted) return <p>Assessment already submitted. Please check your results or start a new assessment.</p>;

    // This is the target message if questions array is empty AFTER loading attempt and no error string was set.
    if (!isLoading && !error && questions.length === 0) {
        return <ErrorMessage message="No questions are currently available for this assessment. Please contact support." />;
    }

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
        // This state can happen briefly if questions are being loaded or if something went wrong
        // console.warn("AssessmentPage: currentQuestion is undefined. Curent state:", { currentQuestionIndex, questionsLength: questions.length, isLoading, error });
        if (isLoading) return <LoadingSpinner message="Preparing question..." />; // More specific loading
        return <ErrorMessage message="Could not load the current question. Please try refreshing or navigating." />;
    }

    return (
        <div className="assessment-page-container">
            <div className="assessment-main-content">
                <QuestionDisplay
                    question={currentQuestion}
                    selectedOption={userAnswers[currentQuestion._id]}
                    onSelectOption={(option) => selectAnswer(currentQuestion._id, option)}
                />
                <NavigationButtons
                    onPrev={prevQuestion}
                    onNext={nextQuestion}
                    onSubmit={() => submitAssessment('completed')}
                    isFirst={currentQuestionIndex === 0}
                    isLast={currentQuestionIndex === questions.length - 1}
                    totalQuestions={questions.length}
                    currentQuestionNumber={currentQuestionIndex + 1}
                />
            </div>
            <aside className="assessment-sidebar">
                <Timer initialTime={timer} onTimeout={() => submitAssessment('timed-out')} isSubmitted={isAssessmentSubmitted} />
                <QuestionNavigator
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    questionStatus={questionStatus}
                    onJumpToQuestion={jumpToQuestion}
                />
                <button
                    onClick={() => submitAssessment('completed')}
                    className="submit-button-sidebar"
                    disabled={isLoading || isAssessmentSubmitted}
                >
                    {isLoading && isAssessmentSubmitted === false ? 'Submitting...' : 'Submit Test'}
                </button>
            </aside>
        </div>
    );
}

export default AssessmentPage;