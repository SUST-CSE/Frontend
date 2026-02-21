import { apiSlice } from '@/store/apiSlice';

export const applicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplications: builder.query({
      query: (params) => ({
        url: '/applications',
        params,
      }),
      providesTags: ['Application'],
    }),
    getMyApplications: builder.query({
      query: () => '/applications/me',
      providesTags: ['Application'],
    }),
    getApplicationById: builder.query({
      query: (id) => `/applications/${id}`,
      providesTags: ['Application'],
    }),
    submitApplication: builder.mutation({
      query: (data) => {
        // If data is FormData (file upload), send as-is
        if (data instanceof FormData) {
          return {
            url: '/applications',
            method: 'POST',
            body: data,
          };
        }
        // Otherwise send JSON
        return {
          url: '/applications',
          method: 'POST',
          body: data,
        };
      },
      invalidatesTags: ['Application'],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ id, status, feedback }) => ({
        url: `/applications/${id}/status`,
        method: 'PATCH',
        body: { status, feedback },
      }),
      invalidatesTags: ['Application'],
    }),
    approveApplicationStage: builder.mutation({
      query: ({ id, stage, status, feedback }) => ({
        url: `/applications/${id}/approve-stage`,
        method: 'POST',
        body: { stage, status, feedback },
      }),
      invalidatesTags: ['Application'],
    }),
  }),
});

export const {
  useGetApplicationsQuery,
  useGetMyApplicationsQuery,
  useGetApplicationByIdQuery,
  useSubmitApplicationMutation,
  useUpdateApplicationStatusMutation,
  useApproveApplicationStageMutation,
} = applicationApi;
