import { createSlice } from "@reduxjs/toolkit";
import {
  generateQuizzesApi,
  createQuizApi,
  createManyQuizzesApi,
  getAllQuizzesApi,
  getQuizByIdApi,
  updateQuizApi,
  deleteQuizApi,
  getQuizRulesApi,
  getNeedsReviewCountApi,
  getHardQuizzesCountApi,
  getRandomMixedQuizzesApi,
} from "../apiCalls/quizApi";

const initialState = {
  quizzes: [],
  quizIds: [],
  allQuizzes: [],
  quizRules: [],
  needsReviewCount: null,
  hardQuizzesCount: null,
  lastAnswered: null,
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
    addQuiz: (state, action) => {
      state.quizzes.push(action.payload);
    },
    setQuizIds: (state, action) => {
      state.quizIds = action.payload;
    },
    addQuizId: (state, action) => {
      if (!state.quizIds.includes(action.payload)) {
        state.quizIds.push(action.payload);
      }
    },
    removeQuizId: (state, action) => {
      state.quizIds = state.quizIds.filter((id) => id !== action.payload);
    },
    clearQuizIds: (state) => {
      state.quizIds = [];
    },
    setAllQuizzes: (state, action) => {
      state.allQuizzes = action.payload;
    },
    setQuizRules: (state, action) => {
      state.quizRules = action.payload;
    },
    setNeedsReviewCount: (state, action) => {
      state.needsReviewCount = action.payload;
    },
    setHardQuizzesCount: (state, action) => {
      state.hardQuizzesCount = action.payload;
    },
    setLastAnswered: (state, action) => {
      state.lastAnswered = action.payload;
    },
    updateQuizInState: (state, action) => {
      const index = state.quizzes.findIndex(
        (q) => q._id === action.payload._id
      );
      if (index !== -1) {
        state.quizzes[index] = action.payload;
      }
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
    setRandomMixedQuizzes: (state, action) => {
      state.randomMixedQuizzes = action.payload;
    },
  },
});

// Thunks
export const fetchGeneratedQuizzes = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const data = await generateQuizzesApi(payload);
    dispatch(setQuizzes(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchAllQuizzes =
  (params = {}) =>
  async (dispatch) => {
    dispatch(setLoading());
    try {
      const data = await getAllQuizzesApi(params);
      dispatch(setAllQuizzes(data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

export const fetchQuizRules = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const data = await getQuizRulesApi();
    dispatch(setQuizRules(data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchNeedsReviewCount = () => async (dispatch) => {
  try {
    const count = await getNeedsReviewCountApi();
    dispatch(setNeedsReviewCount(count));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchHardQuizzesCount = () => async (dispatch) => {
  try {
    const count = await getHardQuizzesCountApi();
    dispatch(setHardQuizzesCount(count));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const fetchRandomMixedQuizzes =
  (limit = 10) =>
  async (dispatch) => {
    dispatch(setLoading());
    try {
      const data = await getRandomMixedQuizzesApi(limit);
      dispatch(setRandomMixedQuizzes(data));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };

export const {
  setQuizzes,
  addQuiz,
  setQuizIds,
  addQuizId,
  removeQuizId,
  clearQuizIds,
  setAllQuizzes,
  setQuizRules,
  setNeedsReviewCount,
  setHardQuizzesCount,
  setLastAnswered,
  updateQuizInState,
  clearQuizzes,
  setLoading,
  setError,
} = quizSlice.actions;

export default quizSlice.reducer;
