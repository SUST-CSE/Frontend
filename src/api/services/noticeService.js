import apiClient from '../client';

const noticeService = {
    getNotices: async () => {
        const response = await apiClient.get('/notices');
        return response.data;
    },

    getNoticeById: async (id) => {
        const response = await apiClient.get(`/notices/${id}`);
        return response.data;
    },

    createNotice: async (data) => {
        const response = await apiClient.post('/notices', data);
        return response.data;
    },

    updateNotice: async (id, data) => {
        const response = await apiClient.put(`/notices/${id}`, data);
        return response.data;
    },

    deleteNotice: async (id) => {
        const response = await apiClient.delete(`/notices/${id}`);
        return response.data;
    },

    uploadAttachments: async (formData) => {
        const response = await apiClient.post('/notices/upload-attachments', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default noticeService;
