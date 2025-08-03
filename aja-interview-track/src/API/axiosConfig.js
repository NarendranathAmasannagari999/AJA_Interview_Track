import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Create axios instance with default config
const baseURL = 'http://localhost:8080';
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Decode JWT token and check if it's valid
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token info or null if invalid
 */
const validateToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < now) {
      console.warn('JWT token is expired');
      return null;
    }
    
    return {
      email: decoded.sub || decoded.email,
      role: decoded.role,
      employeeId: decoded.employeeId,
      exp: decoded.exp,
      iat: decoded.iat
    };
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return null;
  }
};

// Add request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Validate token before sending request
      const tokenInfo = validateToken(token);
      if (tokenInfo) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Token is invalid or expired, clear it
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('employeeId');
        console.warn('Removed invalid/expired token');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired or invalid
          console.warn('401 Unauthorized - Clearing authentication data');
          localStorage.removeItem('jwt_token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('employeeId');
          
          // Only redirect if not already on login page
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Insufficient permissions
          console.error('403 Forbidden - Insufficient permissions');
          // Log detailed permission info for debugging
          const token = localStorage.getItem('jwt_token');
          const userRole = localStorage.getItem('userRole');
          if (token) {
            try {
              const decoded = jwtDecode(token);
              console.error('Permission denied. User role:', decoded.role, 'Required role not available');
            } catch (e) {
              console.error('Permission denied. Invalid token');
            }
          }
          break;
        case 429:
          // Rate limiting
          console.error('429 Too Many Requests - Rate limit exceeded');
          break;
        case 500:
          // Server error
          console.error('500 Internal Server Error:', error.response.data);
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('Network error: No response received');
    } else {
      // Request setup error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 

