// slices/wordSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  words: [],
  wordIds: [], // ✅ أضف دي
};

const wordSlice = createSlice({
  name: "word",
  initialState,
  reducers: {
    addWord: (state, action) => {
      state.words.push(action.payload);
    },
    setWords: (state, action) => {
      state.words = action.payload;
    },

    // ✅ إدارة wordIds
    setWordIds: (state, action) => {
      state.wordIds = action.payload;
    },
    addWordId: (state, action) => {
      if (!state.wordIds.includes(action.payload)) {
        state.wordIds.push(action.payload);
      }
    },
    removeWordId: (state, action) => {
      state.wordIds = state.wordIds.filter((id) => id !== action.payload);
    },
    clearWordIds: (state) => {
      state.wordIds = [];
    },
  },
});

export const {
  addWord,
  setWords,
  setWordIds,
  addWordId,
  removeWordId,
  clearWordIds,
} = wordSlice.actions;

export default wordSlice.reducer;
