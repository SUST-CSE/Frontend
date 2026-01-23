import { apiSlice } from '@/store/apiSlice';

export const alumniApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAlumni: builder.query({
      query: (params) => ({
        url: '/alumni',
        params,
      }),
      providesTags: ['Alumni'],
    }),
    getAlumniById: builder.query({
      query: (id) => `/alumni/${id}`,
      providesTags: (result, error, id) => [{ type: 'Alumni', id }],
    }),
    createAlumni: builder.mutation({
      query: (formData) => ({
        url: '/alumni',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Alumni'],
    }),
    updateAlumni: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/alumni/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Alumni', id }, 'Alumni'],
    }),
    deleteAlumni: builder.mutation({
      query: (id) => ({
        url: `/alumni/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Alumni'],
    }),
    addAlumniFromUser: builder.mutation({
      query: (data) => ({
        url: '/alumni/add-from-user',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Alumni'],
    }),
    graduateSession: builder.mutation({
      query: (data) => ({
        url: '/alumni/graduate-session',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Alumni'],
    }),
  }),
});

export const {
  useGetAllAlumniQuery,
  useGetAlumniByIdQuery,
  useCreateAlumniMutation,
  useUpdateAlumniMutation,
  useDeleteAlumniMutation,
  useAddAlumniFromUserMutation,
  useGraduateSessionMutation,
} = alumniApi;
