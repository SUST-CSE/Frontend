import apiClient from '../client';

const courseOfferingService = {
    // Admin: Create course offering (assign course to teacher)
    createOffering: async (data) => {
        const response = await apiClient.post('/course-offerings', data);
        return response.data;
    },

    // Get all course offerings
    getCourseOfferings: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });
        const url = params.toString() ? `/course-offerings?${params}` : '/course-offerings';
        const response = await apiClient.get(url);
        return response.data;
    },

    // Get course offering by ID
    getCourseOfferingById: async (id) => {
        const response = await apiClient.get(`/course-offerings/${id}`);
        return response.data;
    },

    // Teacher: Get my course offerings
    getMyOfferings: async () => {
        const response = await apiClient.get('/course-offerings/my-offerings');
        return response.data;
    },

    // Admin: Update course offering
    updateOffering: async (id, data) => {
        const response = await apiClient.put(`/course-offerings/${id}`, data);
        return response.data;
    },

    // Admin: Delete course offering
    deleteOffering: async (id) => {
        const response = await apiClient.delete(`/course-offerings/${id}`);
        return response.data;
    },
};

export default courseOfferingService;
