import apiClient from '../client';

const complaintService = {
    submitComplaint: async (data) => {
        const response = await apiClient.post('/complaints', data);
        return response.data;
    },

    getMyComplaints: async () => {
        const response = await apiClient.get('/complaints/my');
        return response.data;
    },

    getAllComplaints: async () => {
        const response = await apiClient.get('/complaints');
        return response.data;
    }
};

export default complaintService;
