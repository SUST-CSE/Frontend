import apiClient from '../client';

const contactService = {
    submitContact: async (data) => {
        const response = await apiClient.post('/contact', data);
        return response.data;
    },

    getContacts: async () => {
        const response = await apiClient.get('/contact');
        return response.data;
    },

    getContactById: async (id) => {
        const response = await apiClient.get(`/contact/${id}`);
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await apiClient.patch(`/contact/${id}/read`);
        return response.data;
    },

    deleteContact: async (id) => {
        const response = await apiClient.delete(`/contact/${id}`);
        return response.data;
    }
};

export default contactService;
