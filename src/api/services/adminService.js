import apiClient from '../client';

const adminService = {
    uploadRegistrations: async (registrations) => {
        const response = await apiClient.post('/admin/registrations/bulk', { registrations });
        return response.data;
    },

    getRegistrations: async () => {
        const response = await apiClient.get('/admin/registrations');
        return response.data;
    },

    deleteRegistration: async (id) => {
        const response = await apiClient.delete(`/admin/registrations/${id}`);
        return response.data;
    },

    approveTeacher: async (id) => {
        const response = await apiClient.patch(`/auth/teacher/${id}/approve`);
        return response.data;
    }
};

export default adminService;
