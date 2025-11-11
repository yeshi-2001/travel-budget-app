import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import tripSlice from './tripSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    trips: tripSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;