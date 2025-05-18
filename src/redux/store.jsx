import { configureStore } from "@reduxjs/toolkit";
import lessonReducer from "./slices/lessonSlice"; // استيراد الـ reducer بشكل صحيح
import wordReducer from "./slices/wordSlice"; // استيراد الـ reducer بشكل صحيح
import quizReducer from "./slices/quizSlice";
export const store = configureStore({
  reducer: {
    lesson: lessonReducer, // استخدام الـ reducer هنا
    word: wordReducer,
    quiz: quizReducer,
  },
});
