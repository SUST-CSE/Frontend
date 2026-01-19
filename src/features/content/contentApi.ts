import { apiSlice } from '@/store/apiSlice';

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomepage: builder.query({
      query: () => '/content/homepage',
      providesTags: ['Notice'], // Re-using tags for simplicity or defining specific ones
    }),
    getNotices: builder.query({
      query: () => '/content/notices',
      providesTags: ['Notice'],
    }),
    getNoticeById: builder.query({
      query: (id) => `/content/notices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notice', id }],
    }),
    getAchievements: builder.query({
      query: () => '/content/achievements',
      providesTags: ['Achievement'],
    }),
    createNotice: builder.mutation({
      query: (data) => ({
        url: '/content/notices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Notice'],
    }),
    deleteNotice: builder.mutation({
      query: (id) => ({
        url: `/content/notices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notice'],
    }),
  }),
});

export const {
  useGetHomepageQuery,
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useGetAchievementsQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
} = contentApi;
