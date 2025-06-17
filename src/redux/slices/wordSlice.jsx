import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  words: [],
  wordIds: [],
  reviewCount: null,
  hardWordsCount: null, // ✅ أضف دي
  allWords: [],
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
    setReviewCount: (state, action) => {
      state.reviewCount = action.payload;
    },
    setHardWordsCount: (state, action) => {
      state.hardWordsCount = action.payload;
    },
    setAllWords: (state, action) => {
      state.allWords = action.payload;
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
  setReviewCount,
  setHardWordsCount,
  setAllWords,
} = wordSlice.actions;

export default wordSlice.reducer;
