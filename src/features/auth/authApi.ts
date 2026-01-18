import { apiSlice } from '@/store/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    registerStudent: builder.mutation({
      query: (data) => ({
        url: '/auth/register/student',
        method: 'POST',
        body: data,
      }),
    }),
    registerTeacher: builder.mutation({
      query: (data) => ({
        url: '/auth/register/teacher',
        method: 'POST',
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterStudentMutation,
  useRegisterTeacherMutation,
  useGetMeQuery,
  useLogoutUserMutation,
} = authApi;
