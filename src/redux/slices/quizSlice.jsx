// slices/quizSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { generateQuizzesApi } from "../apiCalls/quizApi"; // تأكد إن الباث صح

const initialState = {
  quizzes: [],
  loading: true,
  error: null,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearQuizzes: (state) => {
      state.quizzes = [];
      state.loading = true;
      state.error = null;
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// 👉 Thunk Function جوا نفس الملف
export const fetchGeneratedQuizzes = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const data = await generateQuizzesApi(payload);
    dispatch(setQuizzes(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const { setQuizzes, clearQuizzes, setLoading, setError } =
  quizSlice.actions;
export default quizSlice.reducer;
