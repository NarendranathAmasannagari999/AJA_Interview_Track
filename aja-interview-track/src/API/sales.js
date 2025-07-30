import axiosInstance from './axiosConfig';

// Base URL for sales-related endpoints
const BASE_URL = '/api/sales';

/**
 * Get user by role (ROLE_SALES_TEAM)
 * @returns {Promise<User>} User object with ROLE_SALES_TEAM
 */
export const getUserByRole = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/user`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get candidates with optional filters
 * @param {string} technology - Optional technology filter (default: 'all')
 * @param {string} status - Optional status filter (default: 'all')
 * @param {string} resourceType - Optional resource type filter (default: 'all')
 * @returns {Promise<Array<Employee>>} List of candidates
 */
export const getCandidates = async (technology = 'all', status = 'all', resourceType = 'all') => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/candidates`, {
      params: { technology, status, resourceType },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Schedule a client interview
 * @param {string} empId - Employee ID
 * @param {string} client - Client name
 * @param {string} date - Interview date in ISO format (YYYY-MM-DD)
 * @param {string} time - Interview time in HH:mm:ss format
 * @param {number} level - Interview level
 * @param {string} jobDescriptionTitle - Job description title
 * @param {string} meetingLink - Meeting link
 * @param {boolean} deployedStatus - Deployment status
 * @returns {Promise<ClientInterview>} Scheduled interview object
 */
export const scheduleClientInterview = async (
  empId,
  client,
  date,
  time,
  level,
  jobDescriptionTitle,
  meetingLink,
  deployedStatus = false
) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/interviews/schedule`, null, {
      params: {
        empId,
        interviewType: 'client',
        date,
        time: time.includes(':') ? time : `${time}:00`,
        client,
        level,
        jobDescriptionTitle,
        meetingLink,
        deployedStatus,
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Schedule multiple client interviews for an employee
 * @param {string} empId - Employee ID
 * @param {Array<ClientInterviewSchedule>} schedules - Array of interview schedules
 * @returns {Promise<Array<ClientInterview>>} Array of scheduled interviews
 */
export const scheduleMultipleClientInterviews = async (empId, schedules) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/employees/${empId}/interviews`, schedules);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update client interview feedback
 * @param {number} interviewId - Interview ID
 * @param {Object} feedbackData - Interview feedback data
 * @param {string} feedbackData.result - Interview result
 * @param {string} feedbackData.feedback - Interview feedback
 * @param {string|number} feedbackData.technicalScore - Technical score
 * @param {string|number} feedbackData.communicationScore - Communication score
 * @param {boolean} feedbackData.deployedStatus - Deployment status
 * @returns {Promise<Object>} Updated interview object
 */
export const updateClientInterview = async (interviewId, feedbackData) => {
  try {
    const techScore = Number(feedbackData.technicalScore);
    const commScore = Number(feedbackData.communicationScore);

    if (isNaN(techScore) || techScore < 0 || techScore > 10) {
      throw new Error('Technical score must be a number between 0 and 10');
    }
    if (isNaN(commScore) || commScore < 0 || commScore > 10) {
      throw new Error('Communication score must be a number between 0 and 10');
    }

    const formattedData = {
      result: String(feedbackData.result),
      feedback: String(feedbackData.feedback),
      technicalScore: techScore,
      communicationScore: commScore,
      deployedStatus: Boolean(feedbackData.deployedStatus),
    };

    const response = await axiosInstance.put(`${BASE_URL}/client-interviews/${interviewId}`, formattedData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get client interviews with optional search
 * @param {string} search - Optional search term
 * @returns {Promise<Array<ClientInterview>>} List of client interviews
 */
export const getClientInterviews = async (search = null) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/client-interviews`, {
      params: { search },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get total count of scheduled client interviews
 * @returns {Promise<number>} Total count of interviews
 */
export const getClientInterviewCount = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/get-all-scheduleclientinterview-count`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Add a new client
 * @param {Object} clientData - Client data
 * @param {string} clientData.name - Client name
 * @param {string} clientData.contactEmail - Contact email
 * @param {number} clientData.activePositions - Number of active positions
 * @param {Array<string>} clientData.technologies - List of technologies
 * @returns {Promise<Client>} Added client object
 */
export const addClient = async (clientData) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/clients`, null, {
      params: clientData,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get clients with optional search
 * @param {string} search - Optional search term
 * @returns {Promise<Array<Client>>} List of clients
 */
export const getClients = async (search = null) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/clients`, {
      params: { search },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Add a new job description
 * @param {Object} jdData - Job description data
 * @param {string} jdData.title - Job title
 * @param {string} jdData.client - Client name
 * @param {string} jdData.receivedDate - Received date (YYYY-MM-DD)
 * @param {string} jdData.deadline - Deadline date (YYYY-MM-DD)
 * @param {string} jdData.technology - Technology
 * @param {string} jdData.resourceType - Resource type
 * @param {string} jdData.description - Job description
 * @param {File} jdData.file - Job description file
 * @returns {Promise<JobDescription>} Added job description object
 */
export const addJobDescription = async (jdData) => {
  try {
    const formData = new FormData();
    Object.entries(jdData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response = await axiosInstance.post(`${BASE_URL}/job-descriptions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get all job descriptions
 * @returns {Promise<Array<JobDescription>>} List of all job descriptions
 */
export const getAllJobDescriptions = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/job-descriptions`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Download job description file
 * @param {number} jdId - Job description ID
 * @returns {Promise<Blob>} Job description file blob
 */
export const downloadJobDescription = async (jdId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/job-descriptions/${jdId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete job description
 * @param {number} jdId - Job description ID
 * @returns {Promise<void>}
 */
export const deleteJobDescription = async (jdId) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/job-descriptions/${jdId}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get client interview feedback
 * @param {number} interviewId - Interview ID
 * @returns {Promise<Object>} Interview feedback object
 */
export const getClientInterviewFeedback = async (interviewId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/client-interviews/${interviewId}/feedback`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get deployed employees
 * @returns {Promise<Array<Employee>>} List of deployed employees
 */
export const getDeployedEmployees = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/employees/deployed`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update profile picture
 * @param {number} employeeId - Employee ID
 * @param {File} file - Profile picture file (JPEG or PNG)
 * @returns {Promise<User>} Updated user object
 */
export const updateProfilePicture = async (employeeId, file) => {
  try {
    if (!file || !['image/jpeg', 'image/png'].includes(file.type)) {
      throw new Error('Profile picture must be a JPEG or PNG file');
    }

    const formData = new FormData();
    formData.append('Id', employeeId); // Backend expects 'Id' parameter
    formData.append('file', file);

    const response = await axiosInstance.put(`${BASE_URL}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get profile picture
 * @param {number} employeeId - Employee ID
 * @returns {Promise<Blob>} Profile picture blob
 */
export const getProfilePicture = async (employeeId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/profile-picture/${employeeId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Helper function to handle API errors
 * @param {Error} error - The error object
 * @throws {Error} Formatted error message
 */
const handleApiError = (error) => {
  if (error.response) {
    const errorMessage = error.response.data?.message || error.response.data || 'An error occurred';
    switch (error.response.status) {
      case 400:
        return new Error(errorMessage || 'Invalid request data');
      case 401:
        return new Error('Unauthorized: Please login to access this resource');
      case 403:
        return new Error(errorMessage || 'Access denied: You do not have permission to perform this action');
      case 404:
        return new Error(errorMessage || 'Resource not found');
      case 500:
        return new Error('Internal server error. Please try again later.');
      default:
        return new Error(errorMessage);
    }
  }
  return new Error(error.message || 'An error occurred while processing your request');
};

// Export all functions as a single object
export default {
  getUserByRole,
  getCandidates,
  scheduleClientInterview,
  scheduleMultipleClientInterviews,
  updateClientInterview,
  getClientInterviews,
  getClientInterviewCount,
  addClient,
  getClients,
  addJobDescription,
  getAllJobDescriptions,
  downloadJobDescription,
  deleteJobDescription,
  getClientInterviewFeedback,
  getDeployedEmployees,
  updateProfilePicture,
  getProfilePicture,
};
