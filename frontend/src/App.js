import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';

import StudentEntryPage from './pages/student/StudentEntryPage';
import AssessmentPage from './pages/student/AssessmentPage';
import AssessmentResultPage from './pages/student/AssessmentResultPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import SubmissionDetailsPage from './pages/admin/SubmissionDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const ProtectedAssessmentRoute = ({ children }) => {
    const { isAssessmentStarted, userId } = useAssessment();
    // console.log("ProtectedAssessmentRoute:", { isAssessmentStarted, userId });
    if (!isAssessmentStarted || !userId) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const ProtectedResultRoute = ({ children }) => {
    const { isAssessmentSubmitted, submissionResult } = useAssessment();
    // console.log("ProtectedResultRoute:", { isAssessmentSubmitted, submissionResult: !!submissionResult });
    if (!isAssessmentSubmitted || !submissionResult) {
        return <Navigate to="/" replace />;
    }
    return children;
};

function AppRoutes() {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>Online Test - CAT Preparation</h1>
            </header>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<StudentEntryPage />} />
                    <Route
                        path="/assessment"
                        element={
                            <ProtectedAssessmentRoute>
                                <AssessmentPage />
                            </ProtectedAssessmentRoute>
                        }
                    />
                    <Route
                        path="/assessment/result"
                        element={
                            <ProtectedResultRoute>
                                <AssessmentResultPage />
                            </ProtectedResultRoute>
                        }
                    />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/submission/:submissionId" element={<SubmissionDetailsPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <footer className="app-footer">
                <p>© {new Date().getFullYear()} Assessment Platform</p>
            </footer>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AssessmentProvider>
                <AppRoutes />
            </AssessmentProvider>
        </Router>
    );
}

export default App;