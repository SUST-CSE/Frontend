import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers) => {
      const token = Cookies.get('token');
      // console.log('API Request Token:', token); // Debug Log
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Notice', 'Achievement', 'Event', 'Society', 'Payment', 'Course', 'Post', 'Alumni', 'Homepage', 'Product', 'WorkAssignment', 'Application', 'Finance', 'EmailLog', 'ImportantData'],
  endpoints: (builder) => ({}),
});
