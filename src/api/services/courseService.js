import apiClient from '../client';

const courseService = {
    getCourses: async () => {
        const response = await apiClient.get('/courses');
        return response.data;
    },

    getCourseById: async (id) => {
        const response = await apiClient.get(`/courses/${id}`);
        return response.data;
    },

    getCoursesByLevel: async (level) => {
        const response = await apiClient.get(`/courses/level/${level}`);
        return response.data;
    },

    createCourse: async (data) => {
        const response = await apiClient.post('/courses', data);
        return response.data;
    },

    updateCourse: async (id, data) => {
        const response = await apiClient.put(`/courses/${id}`, data);
        return response.data;
    },

    deleteCourse: async (id) => {
        const response = await apiClient.delete(`/courses/${id}`);
        return response.data;
    }
};

export default courseService;
