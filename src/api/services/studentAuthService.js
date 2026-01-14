import apiClient from '../client';

const studentAuthService = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/student/login', { email, password });
        return response.data;
    },

    register: async (data) => {
        const response = await apiClient.post('/auth/student/register', data);
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/student/me');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await apiClient.put('/auth/student/profile', data);
        return response.data;
    }
};

export default studentAuthService;
