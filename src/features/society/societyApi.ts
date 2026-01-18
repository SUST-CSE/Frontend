import { apiSlice } from '@/store/apiSlice';

export const societyApi = apiSlice.injectEndpoints({
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
      query: (id) => `/society/${id}/members/current`,
      providesTags: (result, error, id) => [{ type: 'Society', id: `MEMBERS-${id}` }],
    }),
    getFormerSocietyMembers: builder.query({
      query: (id) => `/society/${id}/members/past`,
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
    addMember: builder.mutation({
      query: ({ societyId, ...data }) => ({
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
        url: `/society/${societyId}/members/${memberId}`,
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
  useAddMemberMutation,
  useRemoveMemberMutation,
} = societyApi;
