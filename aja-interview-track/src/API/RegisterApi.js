import axios from 'axios';

const baseURL = 'http://localhost:8080';

export const registerUser = async (userData) => {
    try {
        // Create a new axios instance without authentication for registration
        const response = await axios.post(`${baseURL}/api/auth/register`, null, {
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
