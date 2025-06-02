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
        throw error.response?.data || error.message;
    }
};

// Schedule a mock interview
export const scheduleMockInterview = async (empId, date, time, interviewer) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/mock-interviews`, null, {
            params: {
                empId,
                date,
                time,
                interviewer
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

// Schedule an interview (with additional parameters)
export const scheduleInterview = async ({
    empId,
    interviewType,
    date,
    time,
    client,
    interviewer,
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
                interviewer,
                level,
                jobDescriptionTitle,
                meetingLink
            }
        });
        return response.data;
    } catch (error) {
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
