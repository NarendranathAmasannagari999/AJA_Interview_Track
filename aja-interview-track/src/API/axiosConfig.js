
import axios from 'axios';

// Create axios instance with default config
const baseURL = 'http://localhost:8080';
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Add debug logging
      console.log('Request URL:', config.url);
      console.log('Request Headers:', config.headers);
    } else {
      console.warn('No JWT token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
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
          console.warn('Authentication failed: Token expired or invalid');
          localStorage.removeItem('jwt_token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Authorization failed: Insufficient permissions');
          console.error('Request URL:', error.config?.url);
          console.error('Request Headers:', error.config?.headers);
          // Don't redirect, let the component handle the error
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 

