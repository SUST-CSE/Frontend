import apiClient from '../client';

const feedbackService = {
    submitFeedback: async (data) => {
        const response = await apiClient.post('/feedback', data);
        return response.data;
    },

    getCourseFeedback: async (courseId) => {
        const response = await apiClient.get(`/feedback/course/${courseId}`);
        return response.data;
    },

    getTeacherFeedback: async (teacherId) => {
        const response = await apiClient.get(`/feedback/teacher/${teacherId}`);
        return response.data;
    },

    getFeedbackStats: async () => {
        const response = await apiClient.get('/feedback/stats');
        return response.data;
    },

    deleteFeedback: async (id) => {
        const response = await apiClient.delete(`/feedback/${id}`);
        return response.data;
    }
};

export default feedbackService;
