import { apiSlice } from '@/store/apiSlice';

export const financeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (params) => ({
        url: '/finance',
        params,
      }),
      providesTags: ['Finance'],
    }),
    getFinancialSummary: builder.query({
      query: () => '/finance/summary',
      providesTags: ['Finance'],
    }),
    addTransaction: builder.mutation({
      query: (data) => ({
        url: '/finance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Finance'],
    }),
    deleteTransaction: builder.mutation({
      query: (id) => ({
        url: `/finance/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Finance'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetFinancialSummaryQuery,
  useAddTransactionMutation,
  useDeleteTransactionMutation,
} = financeApi;
