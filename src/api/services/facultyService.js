import apiClient from '../client';

const facultyService = {
    getFaculty: async () => {
        const response = await apiClient.get('/faculty');
        return response.data;
    },

    getFacultyById: async (id) => {
        const response = await apiClient.get(`/faculty/${id}`);
        return response.data;
    },

    createFaculty: async (data) => {
        const response = await apiClient.post('/faculty', data);
        return response.data;
    },

    updateFaculty: async (id, data) => {
        const response = await apiClient.put(`/faculty/${id}`, data);
        return response.data;
    },

    deleteFaculty: async (id) => {
        const response = await apiClient.delete(`/faculty/${id}`);
        return response.data;
    }
};

export default facultyService;
