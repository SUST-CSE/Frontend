import apiClient from '../client';

const routineService = {
    getRoutines: async () => {
        const response = await apiClient.get('/routines');
        return response.data;
    },

    createRoutine: async (data) => {
        const response = await apiClient.post('/routines', data);
        return response.data;
    },

    deleteRoutine: async (id) => {
        const response = await apiClient.delete(`/routines/${id}`);
        return response.data;
    }
};

export default routineService;
