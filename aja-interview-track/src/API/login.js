import axios from 'axios';

const baseURL = 'http://localhost:8080';

export const loginUser = async (email, password) => {
    try {
        // Create a clean axios instance without JWT token for login
        const response = await axios.post(`${baseURL}/api/auth/login`, null, {
            params: {
                email: email,
                password: password
            }
        });
        
        // Handle the AuthResponse from backend
        const { token, role } = response.data;
        
        // Store the token in localStorage
        if (token) {
            localStorage.setItem('jwt_token', token);
        }
        
        return { token, role };
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
