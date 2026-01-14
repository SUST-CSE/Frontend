import apiClient from '../client';

const jobService = {
    getJobs: async () => {
        const response = await apiClient.get('/jobs');
        return response.data;
    },

    createJob: async (data) => {
        const response = await apiClient.post('/jobs', data);
        return response.data;
    },

    deleteJob: async (id) => {
        const response = await apiClient.delete(`/jobs/${id}`);
        return response.data;
    }
};

export default jobService;
