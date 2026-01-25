import { apiSlice } from '@/store/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['User'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateMyProfile: builder.mutation({
      query: (formData) => ({
        url: '/users/me',
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    bulkCreateUsers: builder.mutation({
      query: (data) => ({
        url: '/users/bulk-create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getFaculty: builder.query({
      query: () => '/users/faculty',
      providesTags: ['User'],
    }),
    getStudents: builder.query({
      query: (params) => ({
        url: '/users/students',
        params,
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateUserMutation,
  useUpdateMyProfileMutation,
  useDeleteUserMutation,
  useBulkCreateUsersMutation,
  useGetFacultyQuery,
  useGetStudentsQuery,
} = userApi;
