import axiosInstance from './axiosConfig';

export const registerUser = async (userData) => {
    try {
        // Send as query params, not as JSON body
        const params = {
            fullName: userData.fullName,
            empId: userData.empId,
            email: userData.email,
            password: userData.password,
            role: userData.role,
            technology: userData.technology || '',
            resourceType: userData.resourceType || ''
        };
        const response = await axiosInstance.post('/api/auth/register', null, { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};
