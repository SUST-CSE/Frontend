import apiClient from '../client';

const postService = {
    getPosts: async () => {
        const response = await apiClient.get('/posts');
        return response.data;
    },

    createPost: async (data) => {
        const response = await apiClient.post('/posts', data);
        return response.data;
    },

    deletePost: async (id) => {
        const response = await apiClient.delete(`/posts/${id}`);
        return response.data;
    }
};

export default postService;
