import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const checkUserSubmissionStatus = (userId) => apiClient.get(`/assessment/status/${userId}`);

export const fetchQuestions = () => apiClient.get('/questions');

export const submitAssessment = (data) => apiClient.post('/assessment/submit', data);

export const getAdminSubmissions = () => apiClient.get('/admin/submissions');

export const getAdminSubmissionDetails = (submissionId) => apiClient.get(`/admin/submissions/${submissionId}`);

export default apiClient;