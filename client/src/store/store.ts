// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoriesReducer from './categoriesSlice';
import interactiveDictionariesReducer from './interactiveDictionariesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    interactiveDictionaries: interactiveDictionariesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;