import { configureStore } from '@reduxjs/toolkit';
import pathSlice from '../features/pathSlice';
import userSlice from '../features/userSlice';

export const store = configureStore({
    reducer: {
      user: userSlice,
      path: pathSlice,
    },
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({thunk:false})],
  });