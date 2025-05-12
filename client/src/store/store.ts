// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import categoriesReducer from './categoriesSlice';
import interactiveDictionariesReducer from './interactiveDictionariesSlice';
import clickableDictionariesReducer from './clickableDictionariesSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer,
    interactiveDictionaries: interactiveDictionariesReducer,
    clickableDictionaries: clickableDictionariesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;