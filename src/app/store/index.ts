import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "../slices/ui";
import { buildingsApi } from "../api/getBuildings";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [buildingsApi.reducerPath]: buildingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(buildingsApi.middleware),
  devTools: import.meta.env.MODE !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
