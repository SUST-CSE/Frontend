import { apiSlice } from '@/store/apiSlice';

export const blogApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: () => '/blogs',
      providesTags: ['Post'],
    }),
    getPendingBlogs: builder.query({
      query: () => '/blogs/pending',
      providesTags: ['Post'],
    }),
    getMyBlogs: builder.query({
      query: () => '/blogs/mine',
      providesTags: ['Post'],
    }),
    getBlogById: builder.query({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    createBlog: builder.mutation({
      query: (data) => ({
        url: '/blogs',
        method: 'POST',
        body: data,
        formData: data instanceof FormData,
      }),
      invalidatesTags: ['Post'],
    }),
    verifyBlog: builder.mutation({
      query: ({ id, status }) => ({
        url: `/blogs/${id}/verify`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Post'],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetPendingBlogsQuery,
  useGetMyBlogsQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useVerifyBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
