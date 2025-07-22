import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../constants/api";

export interface DashboardStats {
  totalEvents: number;
  pendingRsvps: number;
  upcomingSessions: number;
}

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => "/dashboard/stats",
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;
