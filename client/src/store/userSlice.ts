// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserState = {
  id: string | null;
  name: string;
  user_role: string;
  avatar_url: string;
  likedItems: {
    visualWords: { likeId: number; wordId: number; title: string }[] | [];
    interactiveDictionaries:
      | { likeId: number; dictionaryId: number; dictionaryName: string }[]
      | [];
  };
};

const initialState: { user: UserState } = {
  user: {
    id: null,
    name: "",
    user_role: "user",
    avatar_url: "",
    likedItems: {
      visualWords: [],
      interactiveDictionaries: [],
    },
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = initialState.user;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
