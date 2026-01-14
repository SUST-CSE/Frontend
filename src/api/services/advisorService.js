import apiClient from '../client';

const advisorService = {
    getMyAdvisor: async () => {
        const response = await apiClient.get('/advisors/my-advisor');
        return response.data;
    },

    getMyAdvisees: async () => {
        const response = await apiClient.get('/advisors/my-students');
        return response.data;
    },

    assignAdvisor: async (data) => {
        const response = await apiClient.post('/advisors', data);
        return response.data;
    },

    getAdvisors: async () => {
        const response = await apiClient.get('/advisors');
        return response.data;
    },

    removeAdvisor: async (id) => {
        const response = await apiClient.delete(`/advisors/${id}`);
        return response.data;
    }
};

export default advisorService;
