import apiClient from '../client';

const bannerService = {
    getBanners: async () => {
        const response = await apiClient.get('/banners');
        return response.data;
    },

    getBannerById: async (id) => {
        const response = await apiClient.get(`/banners/${id}`);
        return response.data;
    },

    getAllBanners: async () => {
        const response = await apiClient.get('/banners/admin/all');
        return response.data;
    },

    createBanner: async (data) => {
        const response = await apiClient.post('/banners', data);
        return response.data;
    },

    updateBanner: async (id, data) => {
        const response = await apiClient.put(`/banners/${id}`, data);
        return response.data;
    },

    deleteBanner: async (id) => {
        const response = await apiClient.delete(`/banners/${id}`);
        return response.data;
    },

    toggleBanner: async (id) => {
        const response = await apiClient.patch(`/banners/${id}/toggle`);
        return response.data;
    }
};

export default bannerService;
