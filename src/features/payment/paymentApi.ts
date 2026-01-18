import { apiSlice } from '@/store/apiSlice';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentHistory: builder.query({
      query: () => '/payment/history',
      providesTags: ['Payment'],
    }),
    initiatePayment: builder.mutation({
      query: (data) => ({
        url: '/payment/initiate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    updatePaymentStatus: builder.mutation({
      query: (data) => ({
        url: '/payment/status-update',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetPaymentHistoryQuery,
  useInitiatePaymentMutation,
  useUpdatePaymentStatusMutation,
} = paymentApi;
