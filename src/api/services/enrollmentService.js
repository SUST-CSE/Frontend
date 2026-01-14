import apiClient from '../client';

const enrollmentService = {
    // Student: Request enrollment in a course
    requestEnrollment: async (data) => {
        const response = await apiClient.post('/enrollments/request', data);
        return response.data;
    },

    // Student: Get my enrollments
    getMyEnrollments: async (status) => {
        const url = status ? `/enrollments/my-enrollments?status=${status}` : '/enrollments/my-enrollments';
        const response = await apiClient.get(url);
        return response.data;
    },

    // Teacher: Get enrollment requests
    getEnrollmentRequests: async (status, courseId) => {
        let url = '/enrollments/requests';
        const params = [];
        if (status) params.push(`status=${status}`);
        if (courseId) params.push(`courseId=${courseId}`);
        if (params.length) url += '?' + params.join('&');

        const response = await apiClient.get(url);
        return response.data;
    },

    // Teacher: Approve enrollment
    approveEnrollment: async (id) => {
        const response = await apiClient.patch(`/enrollments/${id}/approve`);
        return response.data;
    },

    // Teacher: Reject enrollment
    rejectEnrollment: async (id) => {
        const response = await apiClient.patch(`/enrollments/${id}/reject`);
        return response.data;
    },

    // Teacher: Get enrolled students for a course
    getEnrolledStudents: async (courseId) => {
        const response = await apiClient.get(`/enrollments/course/${courseId}/students`);
        return response.data;
    },
};

export default enrollmentService;
