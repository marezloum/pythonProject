// src/store/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LikedItem = {
  wordId: number;
  likeId: number;
};

type UserState = {
  id: number | null;
  user_role: string | null;
  likedItems: {
    visualWords:
      | {
          likeId: number;
          wordId: number;
          title: string;
          image: string;
          translate: string;
        }[]
      | [];
    interactiveDictionaries:
      | { likeId: number; dictionaryId: number; dictionaryName: string }[]
      | [];
    interactiveWords: {
      likeId: number;
      wordId: number;
      wordTitle: string;
      image: string;
      translate: string;
    }[]; // Add interactive words
    clickableDictionaries: {
      likeId: number;
      dictionaryId: number;
      dictionaryName: string;
      imageSrc: string;
    }[]; // Add clickable dictionaries
  };
};

const initialState: UserState = {
  id: null,
  user_role: null,
  likedItems: {
    visualWords: [],
    interactiveDictionaries: [], // Initialize interactive dictionaries
    interactiveWords: [], // Initialize interactive words
    clickableDictionaries: [], // Initialize clickable dictionaries
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      state.id = action.payload.id;
      state.user_role = action.payload.user_role;
      state.likedItems = action.payload.likedItems;
    },
    clearUser(state) {
      state.id = null;
      state.user_role = null;
      state.likedItems = {
        visualWords: [],
        interactiveDictionaries: [],
        interactiveWords: [],
        clickableDictionaries: [],
      };
    },
    updateLikedItems(state, action: PayloadAction<UserState["likedItems"]>) {
      state.likedItems = action.payload;
    },
  },
});

export const { setUser, clearUser, updateLikedItems } = userSlice.actions;
export default userSlice.reducer;
