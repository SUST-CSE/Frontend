import apiClient from '../client';

const courseResultService = {
    // Student: Get my results (for enrolled courses)
    getMyResults: async () => {
        const response = await apiClient.get('/course-results/my-results');
        return response.data;
    },

    // Get results for a specific course
    getCourseResults: async (courseId, session, semester) => {
        let url = `/course-results/course/${courseId}`;
        const params = [];
        if (session) params.push(`session=${session}`);
        if (semester) params.push(`semester=${semester}`);
        if (params.length) url += '?' + params.join('&');

        const response = await apiClient.get(url);
        return response.data;
    },

    // Teacher: Upload result file
    uploadCourseResult: async (formData) => {
        const response = await apiClient.post('/course-results/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Teacher: Get my uploaded results
    getMyUploadedResults: async (courseId) => {
        const url = courseId ? `/course-results/my-uploads?courseId=${courseId}` : '/course-results/my-uploads';
        const response = await apiClient.get(url);
        return response.data;
    },

    // Teacher: Delete a result
    deleteResult: async (id) => {
        const response = await apiClient.delete(`/course-results/${id}`);
        return response.data;
    },
};

export default courseResultService;
