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

    // Cost Cycle Endpoints
    createCostRequest: builder.mutation({
      query: (formData) => ({
        url: '/finance/cost/create',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Cost'],
    }),
    
    getMyCostRequests: builder.query({
      query: () => '/finance/cost/my-requests',
      providesTags: ['Cost'],
    }),
    
    getPendingApprovals: builder.query({
      query: () => '/finance/cost/pending-approvals',
      providesTags: ['Cost'],
    }),
    
    getAllCosts: builder.query({
      query: () => '/finance/cost/all',
      providesTags: ['Cost'],
    }),
    
    approveCostRequest: builder.mutation({
      query: ({ id, comment }) => ({
        url: `/finance/cost/approve/${id}`,
        method: 'POST',
        body: { comment },
      }),
      invalidatesTags: ['Cost'],
    }),
    
    rejectCostRequest: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/finance/cost/reject/${id}`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Cost'],
    }),
    
    addCheckNumber: builder.mutation({
      query: ({ id, checkNumber }) => ({
        url: `/finance/cost/add-check/${id}`,
        method: 'POST',
        body: { checkNumber },
      }),
      invalidatesTags: ['Cost', 'Finance'],
    }),
    syncApprovedCosts: builder.mutation({
      query: () => ({
        url: '/finance/cost/sync-finance',
        method: 'POST',
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
  
  // Cost Hooks
  useCreateCostRequestMutation,
  useGetMyCostRequestsQuery,
  useGetPendingApprovalsQuery,
  useGetAllCostsQuery,
  useApproveCostRequestMutation,
  useRejectCostRequestMutation,
  useAddCheckNumberMutation,
  useSyncApprovedCostsMutation,
} = financeApi;
