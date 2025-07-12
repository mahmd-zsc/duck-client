import { configureStore } from "@reduxjs/toolkit";
import lessonReducer from "./slices/lessonSlice";
import wordReducer from "./slices/wordSlice";
import quizReducer from "./slices/quizSlice";
import noteReducer from "./slices/noteSlice";
import lessonGroupReducer from "./slices/lessonGroupSlice"; // ✅ Import the new slice

export const store = configureStore({
  reducer: {
    lesson: lessonReducer,
    word: wordReducer,
    quiz: quizReducer,
    note: noteReducer,
    lessonGroup: lessonGroupReducer, 
  },
});
