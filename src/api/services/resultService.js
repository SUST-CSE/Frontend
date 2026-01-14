import apiClient from '../client';

const resultService = {
    getMyResults: async () => {
        const response = await apiClient.get('/results/my-results');
        return response.data;
    },

    uploadResultManual: async (data) => {
        const response = await apiClient.post('/results/manual', data);
        return response.data;
    },

    uploadResultsExcel: async (formData) => {
        const response = await apiClient.post('/results/upload-excel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getResultsBySession: async (session, semester) => {
        const response = await apiClient.get(`/results/session/${session}/semester/${semester}`);
        return response.data;
    },

    getStudentResults: async (studentId) => {
        const response = await apiClient.get(`/results/student/${studentId}`);
        return response.data;
    },

    deleteResult: async (id) => {
        const response = await apiClient.delete(`/results/${id}`);
        return response.data;
    }
};

export const getMyResults = resultService.getMyResults;
export default resultService;
