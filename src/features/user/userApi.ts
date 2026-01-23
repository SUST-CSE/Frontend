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
  }),
});

export const {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useUpdateMyProfileMutation,
  useDeleteUserMutation,
  useBulkCreateUsersMutation,
} = userApi;
