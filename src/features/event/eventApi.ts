import { apiSlice } from '@/store/apiSlice';

export const eventApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: (params) => ({
        url: '/events',
        params,
      }),
      providesTags: ['Event'],
    }),
    getUpcomingEvents: builder.query({
      query: () => '/events/upcoming',
      providesTags: ['Event'],
    }),
    getOngoingEvents: builder.query({
      query: () => '/events/ongoing',
      providesTags: ['Event'],
    }),
    getEventById: builder.query({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: 'Event', id }],
    }),
    createEvent: builder.mutation({
      query: (data) => ({
        url: '/events',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/events/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Event', { type: 'Event', id }],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetUpcomingEventsQuery,
  useGetOngoingEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
} = eventApi;
