// slices/wordSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  words: [],
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
  },
});

export const { addWord, setWords } = wordSlice.actions;

export default wordSlice.reducer;
