import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";
export const speakersApi = createApi({
  reducerPath: "speakersApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    getSpeakers: builder.query<any[], void>({
      query: () => "/speakers",
    }),
    getSpeaker: builder.query<any, string>({
      query: (id: string) => `/speakers/${id}`,
    }),
    createSpeaker: builder.mutation<any, Partial<any>>({
      query: (body: any) => ({
        url: "/speakers",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetSpeakersQuery,
  useGetSpeakerQuery,
  useCreateSpeakerMutation,
} = speakersApi;
