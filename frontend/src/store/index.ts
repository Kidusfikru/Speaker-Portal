import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { authApi } from "../api/authApi";
import { dashboardApi } from "../api/dashboardApi";
import { profileApi } from "../api/profileApi";
import { eventsApi } from "../api/eventsApi";
import { speakersApi } from "../api/speakersApi";

const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [eventsApi.reducerPath]: eventsApi.reducer,
    [speakersApi.reducerPath]: speakersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      dashboardApi.middleware,
      profileApi.middleware,
      eventsApi.middleware,
      speakersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
