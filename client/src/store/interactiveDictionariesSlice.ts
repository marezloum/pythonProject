// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type InteractiveDictionary = {
  id: number;
  name: string;
  image: string;
};

type AllInteractiveDictionariesState = {
  allInteractiveDictionaries: InteractiveDictionary[] | null;
};

const initialState: AllInteractiveDictionariesState = {
  allInteractiveDictionaries: null,
};

const allInteractiveDictionariesSlice = createSlice({
  name: "interactiveDictionaries",
  initialState,
  reducers: {
    setAllInteractiveDictionaries: (state, action: PayloadAction<InteractiveDictionary[]>) => {
      state.allInteractiveDictionaries = action.payload;
    },
  },
});

export const { setAllInteractiveDictionaries } = allInteractiveDictionariesSlice.actions;
export default allInteractiveDictionariesSlice.reducer;
