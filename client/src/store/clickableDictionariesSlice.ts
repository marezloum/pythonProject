import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ClickableDictionary = {
  id: number;
  imageSrc: string;
  title: string;
  shapes: {
    title: string;
    top: number;
    left: number;
    width: number;
    height: number;
    hidden?: boolean;
  }[];
};

type ClickableDictionariesState = {
  allClickableDictionaries: ClickableDictionary[] | null;
};

const initialState: ClickableDictionariesState = {
  allClickableDictionaries: null,
};

const clickableDictionariesSlice = createSlice({
  name: "clickableDictionaries",
  initialState,
  reducers: {
    setAllClickableDictionaries: (
      state,
      action: PayloadAction<ClickableDictionary[]>
    ) => {
      state.allClickableDictionaries = action.payload;
    },
  },
});

export const { setAllClickableDictionaries } =
  clickableDictionariesSlice.actions;
export default clickableDictionariesSlice.reducer;
