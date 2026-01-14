import apiClient from '../client';

const teacherAuthService = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/teacher/login', { email, password });
        return response.data;
    },

    register: async (data) => {
        const response = await apiClient.post('/auth/teacher/register', data);
        return response.data;
    },

    getProfile: async () => {
        const response = await apiClient.get('/auth/teacher/me');
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await apiClient.put('/auth/teacher/profile', data);
        return response.data;
    },

    getAllTeachers: async () => {
        const response = await apiClient.get('/faculty');
        return response.data;
    },

    getApprovedTeachers: async () => {
        const response = await apiClient.get('/auth/teacher/approved');
        return response.data;
    },

    getPendingTeachers: async () => {
        const response = await apiClient.get('/auth/teacher/pending');
        return response.data;
    },

    approveTeacher: async (id) => {
        const response = await apiClient.patch(`/auth/teacher/${id}/approve`);
        return response.data;
    },

    createTeacher: async (data) => {
        const response = await apiClient.post('/auth/teacher/create', data);
        return response.data;
    }
};

export default teacherAuthService;
