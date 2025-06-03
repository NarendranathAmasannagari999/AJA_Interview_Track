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

// Schedule an interview
export const scheduleInterview = async ({
    empId,
    interviewType,
    date,
    time,
    client,
    interviewerId,
    level,
    jobDescriptionTitle,
    meetingLink
}) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/schedule`, null, {
            params: {
                empId,
                interviewType,
                date,
                time,
                client,
                interviewerId,
                level,
                jobDescriptionTitle,
                meetingLink
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
            throw new Error('Please log in to update feedback');
        } else if (error.response?.status === 403) {
            throw new Error('You are not authorized to update this feedback');
        } else if (error.response?.status === 404) {
            throw new Error('Interview not found');
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
