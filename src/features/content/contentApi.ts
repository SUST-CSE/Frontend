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
  }),
});

export const {
  useGetHomepageQuery,
  useGetNoticesQuery,
  useGetAchievementsQuery,
  useCreateNoticeMutation,
} = contentApi;
