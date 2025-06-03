import { Line } from 'recharts';
import axiosInstance from './axiosConfig';

// Base URL for sales-related endpoints
const BASE_URL = '/api/sales';

/**
 * Get candidates with optional filters
 * @param {string} technology - Optional technology filter
 * @param {string} status - Optional status filter
 * @param {string} resourceType - Optional resource type filter
 * @returns {Promise<Array>} List of candidates
 */
export const getCandidates = async (technology = 'all', status = 'all', resourceType = 'all') => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/candidates`, {
      params: { technology, status, resourceType }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Invalid input parameters');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Schedule a client interview
 * @param {string} empId - Employee ID
 * @param {string} client - Client name
 * @param {string} date - Interview date (YYYY-MM-DD)
 * @param {string} time - Interview time (HH:mm:ss)
 * @param {number} level - Interview level
 * @param {string} jobDescriptionTitle - Job description title
 * @param {string} meetingLink - Meeting link
 * @returns {Promise<Object>} Scheduled interview object
 */
export const scheduleClientInterview = async (empId, client, date, time, level, jobDescriptionTitle, meetingLink) => {
  try {
    if (!empId || !client || !date || !time || !level || !jobDescriptionTitle || !meetingLink) {
      throw new Error('All fields are required for scheduling a client interview');
    }

    const response = await axiosInstance.post(`${BASE_URL}/interviews/schedule`, null, {
      params: {
        empId,
        interviewType: 'client',
        date,
        time,
        client,
        level,
        jobDescriptionTitle,
        meetingLink
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 403) {
      throw new Error('Sales team can only schedule client interviews');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Invalid input data');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Update client interview feedback
 * @param {number} interviewId - Interview ID
 * @param {string} result - Interview result
 * @param {string} feedback - Interview feedback
 * @param {number} technicalScore - Technical score
 * @param {number} communicationScore - Communication score
 * @returns {Promise<Object>} Updated interview object
 */
export const updateClientInterview = async (interviewId, result, feedback, technicalScore, communicationScore) => {
  try {
    if (!interviewId || !result || !feedback || technicalScore === undefined || communicationScore === undefined) {
      throw new Error('All fields are required for updating interview feedback');
    }

    const response = await axiosInstance.put(`${BASE_URL}/client-interviews/${interviewId}`, null, {
      params: {
        result,
        feedback,
        technicalScore,
        communicationScore
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Invalid input data');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Get client interviews with optional search
 * @param {string} search - Optional search term
 * @returns {Promise<Array>} List of client interviews
 */
export const getClientInterviews = async (search = null) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/client-interviews`, {
      params: { search }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Add a new client
 * @param {string} name - Client name
 * @param {string} contactEmail - Contact email
 * @param {number} activePositions - Number of active positions
 * @param {Array<string>} technologies - List of technologies
 * @returns {Promise<Object>} Added client object
 */
export const addClient = async (name, contactEmail, activePositions, technologies) => {
  try {
    if (!name || !contactEmail || activePositions === undefined || !technologies?.length) {
      throw new Error('All fields are required for adding a client');
    }

    const response = await axiosInstance.post(`${BASE_URL}/clients`, null, {
      params: {
        name,
        contactEmail,
        activePositions,
        technologies: technologies.join(',')
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Invalid input data');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Get clients with optional search
 * @param {string} search - Optional search term
 * @returns {Promise<Array>} List of clients
 */
export const getClients = async (search = null) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/clients`, {
      params: { search }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Add a new job description
 * @param {string} title - Job title
 * @param {string} client - Client name
 * @param {string} receivedDate - Received date (YYYY-MM-DD)
 * @param {string} deadline - Deadline date (YYYY-MM-DD)
 * @param {string} technology - Technology
 * @param {string} resourceType - Resource type
 * @param {string} description - Job description
 * @param {File} file - Optional job description file
 * @returns {Promise<Object>} Added job description object
 */
export const addJobDescription = async (title, client, receivedDate, deadline, technology, resourceType, description, file = null) => {
  try {
    if (!title || !client || !receivedDate || !deadline || !technology || !resourceType || !description) {
      throw new Error('All fields except file are required for adding a job description');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('client', client);
    formData.append('receivedDate', receivedDate);
    formData.append('deadline', deadline);
    formData.append('technology', technology);
    formData.append('resourceType', resourceType);
    formData.append('description', description);
    if (file) formData.append('file', file);

    const response = await axiosInstance.post(`${BASE_URL}/job-descriptions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Invalid input data');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Download job description file
 * @param {number} jdId - Job description ID
 * @returns {Promise<Blob>} Job description file blob
 */
export const downloadJobDescription = async (jdId) => {
  try {
    if (!jdId) {
      throw new Error('Job description ID is required');
    }

    const response = await axiosInstance.get(`${BASE_URL}/job-descriptions/${jdId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Job description not found or invalid ID');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Delete job description
 * @param {number} jdId - Job description ID
 * @returns {Promise<void>}
 */
export const deleteJobDescription = async (jdId) => {
  try {
    if (!jdId) {
      throw new Error('Job description ID is required');
    }

    await axiosInstance.delete(`${BASE_URL}/job-descriptions/${jdId}`);
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Job description not found or invalid ID');
    }
    throw error.response?.data || error.message;
  }
};
