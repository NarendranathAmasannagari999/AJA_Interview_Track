import axiosInstance from './axiosConfig';

const API_BASE_URL = '/api/delivery';

// Get employees with optional technology and resource type filters
export const getEmployees = async (technology = 'all', resourceType = 'all') => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/employees`, {
            params: { technology, resourceType }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Please log in to view employees');
        }
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
                interviewType: 'mock', // Only mock interviews are allowed
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
export const updateMockInterviewFeedback = async (interviewId, feedback, technicalScore, communicationScore) => {
    try {
        // Check if user is logged in
        const token = localStorage.getItem('jwt_token');
        if (!token) {
            throw new Error('Please log in to update feedback');
        }

        const response = await axiosInstance.put(`${API_BASE_URL}/mock-interviews/${interviewId}/feedback`, null, {
            params: {
                feedback,
                technicalScore,
                communicationScore
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('jwt_token');
            window.location.href = '/login';
            throw new Error('Please log in to update feedback');
        } else if (error.response?.status === 403) {
            throw new Error('You do not have permission to update feedback. Please ensure you are logged in as a Delivery Team member.');
        } else if (error.response?.status === 404) {
            throw new Error('Interview not found');
        } else if (error.response?.status === 400) {
            throw new Error(error.response.data || 'Invalid feedback data');
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
        if (error.response?.status === 401) {
            throw new Error('Please log in to view upcoming interviews');
        }
        throw error.response?.data || error.message;
    }
};

// Get completed interviews
export const getCompletedInterviews = async () => {
    try {
        const response = await axiosInstance.get(`${API_BASE_URL}/interviews/completed`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Please log in to view completed interviews');
        }
        throw error.response?.data || error.message;
    }
};
