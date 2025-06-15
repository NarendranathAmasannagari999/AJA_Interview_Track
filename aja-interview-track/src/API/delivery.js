// delivery.js
// API service functions for interacting with the delivery backend APIs

import axiosInstance from './axiosConfig';

// Base URL for API endpoints
const API_BASE_URL = '/api/delivery';

// Get employees with optional technology and resource type filters
export const getEmployees = async (technology = 'all', resourceType = 'all') => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/employees`, {
            params: { technology, resourceType }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Schedule a mock interview
export const scheduleInterview = async ({
    empId,
    date,
    time,
    interviewerId
}) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/schedule`, null, {
            params: {
                empId,
                interviewType: 'mock',
                date,
                time,
                interviewerId
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Please log in to schedule interviews');
        } else if (error.response?.status === 403) {
            throw new Error('You are not authorized to schedule this type of interview');
        } else if (error.response?.status === 400) {
            throw new Error('Invalid interview data. Please check all required fields.');
        }
        throw error.response?.data || error.message;
    }
};

// Update mock interview feedback
export const updateMockInterviewFeedback = async (interviewId, technicalFeedback, communicationFeedback, technicalScore, communicationScore, sentToSales) => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/mock-interviews/${interviewId}/feedback`, null, {
            params: {
                technicalFeedback,
                communicationFeedback,
                technicalScore,
                communicationScore,
                sentToSales
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Please log in to update feedback');
        } else if (error.response?.status === 403) {
            throw new Error('You do not have permission to update feedback');
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data || 'Invalid feedback data or interview not found');
        }
        throw error.response?.data || error.message;
    }
};

// Get upcoming interviews
export const getUpcomingInterviews = async () => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/interviews/upcoming`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Get completed interviews
export const getCompletedInterviews = async () => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/interviews/completed`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Update interview status
export const updateInterviewStatus = async (interviewId) => {
    try {
        const response = await axiosInstance.put(`${API_BASE_URL}/mock-interviews/${interviewId}/update-status`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Please log in to update interview status');
        } else if (error.response?.status === 403) {
            throw new Error('You do not have permission to update interview status');
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data || 'Invalid interview status update request');
        }
        throw error.response?.data || error.message;
    }
};

// Update profile picture
export const updateProfilePicture = async (userId, file) => {
    try {
        const formData = new FormData();
        formData.append('Id', userId);
        formData.append('file', file);

        const response = await axiosInstance.put(`${API_BASE_URL}/profile-picture`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Please log in to update profile picture');
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data || 'Invalid file format. Please use JPEG or PNG');
        }
        throw error.response?.data || error.message;
    }
};

// Get profile picture
export const getProfilePicture = async (employeeId) => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/profile-picture/${employeeId}`, {
            responseType: 'blob'
        });
        return URL.createObjectURL(response.data);
    } catch (error) {
        if (error.response?.status === 400) {
            throw new Error('Profile picture not found');
        }
        throw error.response?.data || error.message;
    }
};

// Get mock interview performance data
export const getMockInterviewPerformance = async () => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/mock-interviews/performance`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Export all functions as a single object
export default {
    getEmployees,
    scheduleInterview,
    updateMockInterviewFeedback,
    getUpcomingInterviews,
    getCompletedInterviews,
    updateInterviewStatus,
    updateProfilePicture,
    getProfilePicture,
    getMockInterviewPerformance
};
