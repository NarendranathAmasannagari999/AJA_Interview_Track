import axios from 'axios';

// Create axios instance with default config
const baseURL = 'http://localhost:8080';
const axiosInstance = axios.create({
  baseURL: baseURL
});

// Add request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       localStorage.removeItem('jwt_token');
//       window.location.href = '/login'; // Redirect to login page
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance; 