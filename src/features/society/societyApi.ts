import { apiSlice } from '@/store/apiSlice';

export const societyApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSocieties: builder.query({
      query: () => '/society',
      providesTags: ['Society'],
    }),
    getSocietyById: builder.query({
      query: (id) => `/society/${id}`,
      providesTags: (result, error, id) => [{ type: 'Society', id }],
    }),
    getSocietyMembers: builder.query({
      query: (id) => `/society/${id}/members?isCurrent=true`,
      providesTags: (result, error, id) => [{ type: 'Society', id: `MEMBERS-${id}` }],
    }),
    getFormerSocietyMembers: builder.query({
      query: (id) => `/society/${id}/members?isCurrent=false`,
      providesTags: (result, error, id) => [{ type: 'Society', id: `FORMER-MEMBERS-${id}` }],
    }),
    createSociety: builder.mutation({
      query: (data) => ({
        url: '/society',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Society'],
    }),
    updateSociety: builder.mutation({
      query: ({ id, data }) => ({
        url: `/society/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Society', { type: 'Society', id }],
    }),
    addMember: builder.mutation({
      query: ({ societyId, data }) => ({
        url: `/society/${societyId}/members`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { societyId }) => [
        { type: 'Society', id: `MEMBERS-${societyId}` },
        { type: 'Society', id: `FORMER-MEMBERS-${societyId}` }
      ],
    }),
    removeMember: builder.mutation({
      query: ({ societyId, memberId }) => ({
        url: `/society/members/${memberId}`,
        method: 'DELETE',
        body: {},
      }),
      invalidatesTags: (result, error, { societyId }) => [
        { type: 'Society', id: `MEMBERS-${societyId}` },
        { type: 'Society', id: `FORMER-MEMBERS-${societyId}` }
      ],
    }),
  }),
});

export const {
  useGetSocietiesQuery,
  useGetSocietyByIdQuery,
  useGetSocietyMembersQuery,
  useGetFormerSocietyMembersQuery,
  useCreateSocietyMutation,
  useUpdateSocietyMutation,
  useAddMemberMutation,
  useRemoveMemberMutation,
} = societyApi;
