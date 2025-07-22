import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";
import type { Event, RSVP } from "../types/event";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Events", "Event", "RSVPs"],
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      query: () => ({ url: "/events", method: "GET" }),
      providesTags: ["Events"],
    }),
    getEvent: builder.query<Event, string>({
      query: (id) => ({ url: `/events/${id}`, method: "GET" }),
      providesTags: (_result, _err, id) => [{ type: "Event", id }],
    }),
    createEvent: builder.mutation<Event, Partial<Event>>({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Events"],
    }),
    rsvpEvent: builder.mutation<RSVP, { eventId: string; status: string }>({
      query: ({ eventId, status }) => ({
        url: `/events/${eventId}/rsvp`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: (_result, _err, { eventId }) => [
        { type: "Event", id: eventId },
        { type: "RSVPs", id: eventId },
      ],
    }),
    getEventRsvps: builder.query<RSVP[], string>({
      query: (eventId) => ({
        url: `/events/${eventId}/rsvps`,
        method: "GET",
      }),
      providesTags: (_result, _err, eventId) => [
        { type: "RSVPs", id: eventId },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useRsvpEventMutation,
  useGetEventRsvpsQuery,
} = eventsApi;
