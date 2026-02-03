import { apiSlice } from '@/store/apiSlice';

export const workAssignmentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAssignments: builder.query({
      query: (params) => ({
        url: '/work-assignments',
        params,
      }),
      providesTags: ['WorkAssignment'],
    }),
    getMyWork: builder.query({
      query: () => '/work-assignments/me',
      providesTags: ['WorkAssignment'],
    }),
    getSocietyWork: builder.query({
      query: (societyId) => `/work-assignments/society/${societyId}`,
      providesTags: ['WorkAssignment'],
    }),
    createAssignment: builder.mutation({
      query: (data) => ({
        url: '/work-assignments',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WorkAssignment'],
    }),
    updateWorkStatus: builder.mutation({
      query: ({ id, status, feedback }) => ({
        url: `/work-assignments/${id}/status`,
        method: 'PATCH',
        body: { status, feedback },
      }),
      invalidatesTags: ['WorkAssignment'],
    }),
    updateAssignment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/work-assignments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WorkAssignment'],
    }),
    deleteAssignment: builder.mutation({
      query: (id) => ({
        url: `/work-assignments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WorkAssignment'],
    }),
  }),
});

export const {
  useGetAssignmentsQuery,
  useGetMyWorkQuery,
  useGetSocietyWorkQuery,
  useCreateAssignmentMutation,
  useUpdateWorkStatusMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,
} = workAssignmentApi;
