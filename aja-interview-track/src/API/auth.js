import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const baseURL = 'http://localhost:8080';

// Create a clean axios instance for authentication (without JWT token)
const authAxios = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Decode JWT token and extract user information
 * @param {string} token - JWT token
 * @returns {Object} Decoded token information
 */
const decodeToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return {
      email: decoded.sub || decoded.email,
      role: decoded.role,
      employeeId: decoded.employeeId,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response with token and role
 */
export const registerUser = async (userData) => {
  try {
    const response = await authAxios.post('/api/auth/register', null, {
      params: {
        fullName: userData.fullName,
        empId: userData.empId,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        technology: userData.technology || '',
        resourceType: userData.resourceType || ''
      }
    });
    
    // Handle the AuthResponse from backend
    const { token, role } = response.data;
    
    // Store the token in localStorage
    if (token) {
      localStorage.setItem('jwt_token', token);
      
      // Decode token to extract additional information
      const tokenInfo = decodeToken(token);
      if (tokenInfo) {
        // Store role from token (more reliable than response)
        setUserRole(tokenInfo.role);
        
        // Store employee ID if available in token
        if (tokenInfo.employeeId) {
          setEmployeeId(tokenInfo.employeeId);
        }
      } else {
        // Fallback to response role
        if (role) {
          setUserRole(role);
        }
      }
    }
    
    return { token, role, user: response.data };
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw {
        message: error.response.data || 'Registration failed',
        status: error.response.status
      };
    } else if (error.request) {
      // No response received
      throw {
        message: 'No response from server. Please check your connection.',
        status: 0
      };
    } else {
      // Request setup error
      throw {
        message: 'An error occurred while setting up the request.',
        status: 0
      };
    }
  }
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with token, role, and employee info
 */
export const loginUser = async (email, password) => {
  try {
    const response = await authAxios.post('/api/auth/login', null, {
      params: {
        email: email,
        password: password
      }
    });
    
    // Handle the complex response structure from backend
    const { token, role, user, employee, employeeId } = response.data;
    
    // Store the token in localStorage
    if (token) {
      localStorage.setItem('jwt_token', token);
      
      // Decode token to extract additional information
      const tokenInfo = decodeToken(token);
      if (tokenInfo) {
        // Store role from token (more reliable than response)
        setUserRole(tokenInfo.role);
        
        // Store employee ID from token if available
        if (tokenInfo.employeeId) {
          setEmployeeId(tokenInfo.employeeId);
        }
      } else {
        // Fallback to response data
        if (role) {
          setUserRole(role);
        }
        if (employeeId) {
          setEmployeeId(employeeId);
        }
      }
    }
    
    return { token, role, user, employee, employeeId };
  } catch (error) {
    if (error.response) {
      // Server responded with error (e.g., "Invalid email or password")
      throw {
        message: error.response.data || 'Authentication failed',
        status: error.response.status
      };
    } else if (error.request) {
      // No response received
      throw {
        message: 'No response from server. Please check your connection.',
        status: 0
      };
    } else {
      // Request setup error
      throw {
        message: 'An error occurred while setting up the request.',
        status: 0
      };
    }
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('jwt_token');
  localStorage.removeItem('employeeId');
  localStorage.removeItem('userRole');
  window.location.href = '/login';
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('jwt_token');
  if (!token) return false;
  
  // Check if token is expired
  try {
    const tokenInfo = decodeToken(token);
    if (tokenInfo && tokenInfo.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (tokenInfo.exp < now) {
        // Token is expired, clear it
        logoutUser();
        return false;
      }
    }
    return true;
  } catch (error) {
    // Invalid token, clear it
    logoutUser();
    return false;
  }
};

/**
 * Get current user token
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem('jwt_token');
};

/**
 * Get current user role from token (preferred) or localStorage
 * @returns {string|null} User role or null
 */
export const getUserRole = () => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    const tokenInfo = decodeToken(token);
    if (tokenInfo && tokenInfo.role) {
      return tokenInfo.role;
    }
  }
  return localStorage.getItem('userRole');
};

/**
 * Set user role in localStorage
 * @param {string} role - User role
 */
export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

/**
 * Get employee ID from token (preferred) or localStorage
 * @returns {string|null} Employee ID or null
 */
export const getEmployeeId = () => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    const tokenInfo = decodeToken(token);
    if (tokenInfo && tokenInfo.employeeId) {
      return tokenInfo.employeeId;
    }
  }
  return localStorage.getItem('employeeId');
};

/**
 * Set employee ID in localStorage
 * @param {string} employeeId - Employee ID
 */
export const setEmployeeId = (employeeId) => {
  localStorage.setItem('employeeId', employeeId);
};

/**
 * Get current user email from token
 * @returns {string|null} User email or null
 */
export const getUserEmail = () => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    const tokenInfo = decodeToken(token);
    if (tokenInfo && tokenInfo.email) {
      return tokenInfo.email;
    }
  }
  return null;
};

/**
 * Check if token is expired
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = () => {
  const token = localStorage.getItem('jwt_token');
  if (!token) return true;
  
  try {
    const tokenInfo = decodeToken(token);
    if (tokenInfo && tokenInfo.exp) {
      const now = Math.floor(Date.now() / 1000);
      return tokenInfo.exp < now;
    }
    return true;
  } catch (error) {
    return true;
  }
}; 