import { apiSlice } from '@/store/apiSlice';

export const contentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHomepage: builder.query({
      query: () => '/content/homepage',
      providesTags: ['Homepage'], 
      keepUnusedDataFor: 300,
    }),
    getNotices: builder.query({
      query: () => '/content/notices',
      providesTags: ['Notice'],
      keepUnusedDataFor: 300,
    }),
    getNoticeById: builder.query({
      query: (id) => `/content/notices/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notice', id }],
      keepUnusedDataFor: 300,
    }),
    getAchievements: builder.query({
      query: () => '/content/achievements',
      providesTags: ['Achievement'],
      keepUnusedDataFor: 300,
    }),
    getAchievementById: builder.query({
      query: (id) => `/content/achievements/${id}`,
      providesTags: (result, error, id) => [{ type: 'Achievement', id }],
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
    updateNotice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/content/notices/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Notice', { type: 'Notice', id }],
    }),
    updateHomepage: builder.mutation({
      query: (data) => ({
        url: '/content/homepage',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Homepage'], // Invalidate to refresh homepage data
    }),
    createAchievement: builder.mutation({
      query: (data) => ({
        url: '/content/achievements',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Achievement'],
    }),
    deleteAchievement: builder.mutation({
      query: (id) => ({
        url: `/content/achievements/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Achievement'],
    }),
    updateAchievement: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/content/achievements/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Achievement', { type: 'Achievement', id }],
    }),
    sendMessage: builder.mutation({
      query: (data) => ({
        url: '/content/send-message',
        method: 'POST',
        body: data,
      }),
    }),
    getImportantData: builder.query({
      query: () => '/content/important-data',
      providesTags: ['ImportantData'],
    }),
    createImportantData: builder.mutation({
      query: (data) => ({
        url: '/content/important-data',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['ImportantData'],
    }),
    deleteImportantData: builder.mutation({
      query: (id) => ({
        url: `/content/important-data/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ImportantData'],
    }),
  }),
});

export const {
  useGetHomepageQuery,
  useGetNoticesQuery,
  useGetNoticeByIdQuery,
  useGetAchievementsQuery,
  useGetAchievementByIdQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
  useUpdateHomepageMutation,
  useCreateAchievementMutation,
  useUpdateAchievementMutation,
  useDeleteAchievementMutation,
  useSendMessageMutation,
  useGetImportantDataQuery,
  useCreateImportantDataMutation,
  useDeleteImportantDataMutation,
} = contentApi;
