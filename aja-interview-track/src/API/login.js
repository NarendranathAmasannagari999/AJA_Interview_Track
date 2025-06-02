import axiosInstance from './axiosConfig';

export const loginUser = async (email, password) => {
    try {
        // Ensure email and password are properly encoded in the URL
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);

        const response = await axiosInstance.post('/api/auth/login', null, { 
            params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        const { token, role } = response.data;
        
        // Store the token in localStorage
        localStorage.setItem('jwt_token', token);
        
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
