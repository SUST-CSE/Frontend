import apiClient from '../client';

const studyMaterialService = {
    getMaterials: async () => {
        const response = await apiClient.get('/materials');
        return response.data;
    },

    uploadMaterial: async (data) => {
        const response = await apiClient.post('/materials', data);
        return response.data;
    },

    deleteMaterial: async (id) => {
        const response = await apiClient.delete(`/materials/${id}`);
        return response.data;
    }
};

export default studyMaterialService;
