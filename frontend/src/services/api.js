import axios from 'axios';

const api = axios.create({
    baseURL: '/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getActiveElections = async () => {
    const response = await api.get('/user/elections/active');
    return response.data;
};

export const getCompletedElections = async () => {
    const response = await api.get('/user/elections/completed');
    return response.data;
};

export const getCandidates = async (electionId) => {
    const response = await api.get(`/user/elections/${electionId}/candidates`);
    return response.data;
};

export const castVote = async (electionId, candidateId) => {
    const response = await api.post(`/user/elections/${electionId}/vote`, null, {
        params: { candidateId }
    });
    return response.data;
};

export const checkHasVoted = async (electionId, userId) => {
    const response = await api.get(`/user/elections/${electionId}/has-voted`, {
        params: { userId }
    });
    return response.data;
};

// Admin APIs
export const getAllElections = async () => {
    const response = await api.get('/admin/elections');
    return response.data;
};

export const createElection = async (electionData) => {
    const response = await api.post('/admin/elections', electionData);
    return response.data;
};

export const updateElectionStatus = async (electionId, status) => {
    const response = await api.put(`/admin/elections/${electionId}/status`, null, {
        params: { status }
    });
    return response.data;
};

export const addCandidate = async (electionId, candidateData) => {
    const response = await api.post(`/admin/elections/${electionId}/candidates`, candidateData);
    return response.data;
};

export const calculateResults = async (electionId) => {
    const response = await api.post(`/admin/elections/${electionId}/calculate-results`);
    return response.data;
};

export const getElectionResults = async (electionId) => {
    const response = await api.get(`/admin/elections/${electionId}/results`);
    return response.data;
};
