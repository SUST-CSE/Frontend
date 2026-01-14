import apiClient from '../client';

const admissionService = {
    getAdmissions: async () => {
        const response = await apiClient.get('/admissions');
        return response.data;
    },

    getAdmissionById: async (id) => {
        const response = await apiClient.get(`/admissions/${id}`);
        return response.data;
    },

    createAdmission: async (data) => {
        const response = await apiClient.post('/admissions', data);
        return response.data;
    },

    updateAdmission: async (id, data) => {
        const response = await apiClient.put(`/admissions/${id}`, data);
        return response.data;
    },

    deleteAdmission: async (id) => {
        const response = await apiClient.delete(`/admissions/${id}`);
        return response.data;
    },

    submitApplication: async (id, data) => {
        const response = await apiClient.post(`/admissions/${id}/apply`, data);
        return response.data;
    },

    getApplications: async (id) => {
        const response = await apiClient.get(`/admissions/${id}/applications`);
        return response.data;
    },

    reviewApplication: async (id, action) => {
        const response = await apiClient.patch(`/admissions/applications/${id}/${action}`);
        return response.data;
    }
};

export default admissionService;
