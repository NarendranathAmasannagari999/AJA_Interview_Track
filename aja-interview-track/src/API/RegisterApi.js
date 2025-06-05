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
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};
