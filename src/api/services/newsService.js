import apiClient from '../client';

const newsService = {
    getNews: async () => {
        const response = await apiClient.get('/news');
        return response.data;
    },

    getAllNews: async () => {
        const response = await apiClient.get('/news/all');
        return response.data;
    },

    getNewsById: async (id) => {
        const response = await apiClient.get(`/news/${id}`);
        return response.data;
    },

    createNews: async (data) => {
        const response = await apiClient.post('/news', data);
        return response.data;
    },

    updateNews: async (id, data) => {
        const response = await apiClient.put(`/news/${id}`, data);
        return response.data;
    },

    deleteNews: async (id) => {
        const response = await apiClient.delete(`/news/${id}`);
        return response.data;
    }
};

export default newsService;
