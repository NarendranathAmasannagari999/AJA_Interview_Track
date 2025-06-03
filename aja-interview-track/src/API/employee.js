import axiosInstance from './axiosConfig';

// Base URL for employee-related endpoints
const BASE_URL = '/api/employee';

/**
 * Get mock interviews with optional filters
 * @param {number} employeeId - Optional employee ID to filter interviews
 * @param {string} technology - Optional technology filter
 * @param {string} resourceType - Optional resource type filter
 * @returns {Promise<Array>} List of mock interviews
 */
export const getMockInterviews = async (employeeId = null, technology = 'all', resourceType = 'all') => {
  try {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (technology) params.append('technology', technology);
    if (resourceType) params.append('resourceType', resourceType);

    const response = await axiosInstance.get(`${BASE_URL}/mock-interviews`, { params });
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
 * Get client interviews with optional filters
 * @param {number} employeeId - Optional employee ID to filter interviews
 * @param {string} technology - Optional technology filter
 * @param {string} resourceType - Optional resource type filter
 * @returns {Promise<Array>} List of client interviews
 */
export const getClientInterviews = async (employeeId = null, technology = 'all', resourceType = 'all') => {
  try {
    const params = new URLSearchParams();
    if (employeeId) params.append('employeeId', employeeId);
    if (technology) params.append('technology', technology);
    if (resourceType) params.append('resourceType', resourceType);

    const response = await axiosInstance.get(`${BASE_URL}/client-interviews`, { params });
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
 * Update employee details
 * @param {number} employeeId - Employee ID to update
 * @param {string} technology - Optional technology to update
 * @param {string} empId - Optional employee ID to update
 * @returns {Promise<Object>} Updated employee object
 */
export const updateEmployeeDetails = async (employeeId, technology = null, empId = null) => {
  try {
    const params = new URLSearchParams();
    params.append('employeeId', employeeId);
    if (technology) params.append('technology', technology);
    if (empId) params.append('empId', empId);

    const response = await axiosInstance.put(`${BASE_URL}/me`, null, { params });
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
 * Get job descriptions with optional filters
 * @param {string} search - Optional search term
 * @param {string} technology - Optional technology filter
 * @param {string} resourceType - Optional resource type filter
 * @returns {Promise<Array>} List of job descriptions
 */
export const getJobDescriptions = async (search = null, technology = null, resourceType = null) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (technology) params.append('technology', technology);
    if (resourceType) params.append('resourceType', resourceType);

    const response = await axiosInstance.get(`${BASE_URL}/job-descriptions`, { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Upload resume for an employee
 * @param {number} employeeId - Employee ID
 * @param {number} jdId - Job Description ID
 * @param {File} file - Resume file
 * @returns {Promise<Object>} Uploaded resume object
 */
export const uploadResume = async (employeeId, jdId, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', employeeId);
    formData.append('jdId', jdId);

    const response = await axiosInstance.post(`${BASE_URL}/resumes`, formData, {
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
      throw new Error(error.response.data || 'Invalid file or input data');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Download resume
 * @param {number} resumeId - Resume ID to download
 * @returns {Promise<Blob>} Resume file blob
 */
export const downloadResume = async (resumeId) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/resumes/${resumeId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Resume not found or invalid ID');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Delete resume
 * @param {number} resumeId - Resume ID to delete
 * @returns {Promise<void>}
 */
export const deleteResume = async (resumeId) => {
  try {
    await axiosInstance.delete(`${BASE_URL}/resumes/${resumeId}`);
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data || 'Resume not found or invalid ID');
    }
    throw error.response?.data || error.message;
  }
};

/**
 * Add interview question
 * @param {string} technology - Technology for the question
 * @param {string} question - Question text
 * @param {string} user - User who added the question
 * @returns {Promise<Object>} Added interview question
 */
export const addInterviewQuestion = async (technology, question, user) => {
  try {
    const params = new URLSearchParams();
    params.append('technology', technology);
    params.append('question', question);
    params.append('user', user);

    const response = await axiosInstance.post(`${BASE_URL}/interview-questions`, null, { params });
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
 * Get interview questions
 * @param {string} technology - Optional technology filter
 * @returns {Promise<Array>} List of interview questions
 */
export const getInterviewQuestions = async (technology = 'all') => {
  try {
    const params = new URLSearchParams();
    params.append('technology', technology);

    const response = await axiosInstance.get(`${BASE_URL}/interview-questions`, { params });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access this resource');
    }
    throw error.response?.data || error.message;
  }
};
