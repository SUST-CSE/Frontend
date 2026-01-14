import apiClient from '../client';

const authService = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },

    register: async (data) => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    }
};

export default authService;
