import apiClient from '../client';

const societyService = {
    getSocieties: async () => {
        const response = await apiClient.get('/societies');
        return response.data;
    },

    createSociety: async (data) => {
        const response = await apiClient.post('/societies', data);
        return response.data;
    },

    deleteSociety: async (id) => {
        const response = await apiClient.delete(`/societies/${id}`);
        return response.data;
    }
};

export default societyService;
