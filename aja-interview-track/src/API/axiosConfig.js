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
          localStorage.removeItem('jwt_token');
          window.location.href = '/login';
          break;
        case 403:
          // Insufficient permissions
          console.error('Authorization failed: Insufficient permissions');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', null, {
        params: { email, password }
      });
      const { token, role } = response.data;
      if (token) {
        localStorage.setItem('jwt_token', token);
      }
      return { token, role };
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/register', null, {
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
      const { token, role } = response.data;
      if (token) {
        localStorage.setItem('jwt_token', token);
      }
      return { token, role, user: response.data };
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '/login';
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/current-user');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default axiosInstance; 

