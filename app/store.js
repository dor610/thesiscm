import { configureStore } from '@reduxjs/toolkit';
import pathSlice from '../features/pathSlice';
import userSlice from '../features/userSlice';
import semesterSlice from "../features/semesterSlice";
import courseSlice from '../features/courseSlice';
import topicSlice from '../features/topicSlice';
import presentationSlice from '../features/presentationSlice';

export const store = configureStore({
    reducer: {
      user: userSlice,
      path: pathSlice,
      semester: semesterSlice,
      course: courseSlice,
      topic: topicSlice,
      presentation: presentationSlice,
    },
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware({thunk:false})],
  });