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
  }),
});

export const {
  useGetAllUsersQuery,
} = userApi;
