import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQueryWithAuth";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    updateProfile: builder.mutation<void, FormData>({
      query: (formData) => ({
        url: "/speakers/me",
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const { useUpdateProfileMutation } = profileApi;
