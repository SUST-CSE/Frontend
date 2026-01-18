import { apiSlice } from '@/store/apiSlice';

export const academicApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => '/academic/courses',
      providesTags: ['Course'],
    }),
    getAcademicStats: builder.query({
      query: () => '/academic/statistics',
      providesTags: ['Course'],
    }),
    getAcademicAchievements: builder.query({
      query: () => '/academic/achievements',
      providesTags: ['Achievement'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetAcademicStatsQuery,
  useGetAcademicAchievementsQuery,
} = academicApi;
