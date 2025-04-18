// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Category = {
  id: number;
  name: string;
}
type CategoriesState = {
  allCategories: Category[] | null;
}

const initialState: CategoriesState = {
  allCategories: null,
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setAllCategories: (state, action: PayloadAction<Category[]>) => {
      state.allCategories = action.payload;
    }
  },
});

export const { setAllCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;