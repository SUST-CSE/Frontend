import apiClient from '../client';

const statsService = {
    getStats: async () => {
        const response = await apiClient.get('/stats');
        return response.data;
    }
};

export default statsService;
