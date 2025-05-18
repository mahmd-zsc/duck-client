import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addLessonApi,
  deleteLessonApi,
  getLessonByIdApi,
  getLessonsApi,
} from "../apiCalls/lessonApi"; // استيراد دوال الـ API

export const addLesson = createAsyncThunk(
  "lesson/addLesson",
  async (lessonData, { rejectWithValue }) => {
    try {
      const data = await addLessonApi(lessonData); // استدعاء دالة API
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLessons = createAsyncThunk(
  "lesson/getLessons",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getLessonsApi(); // استدعاء دالة API لجلب الدروس
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLessonById = createAsyncThunk(
  "lesson/getLessonById",
  async (lessonId, { rejectWithValue }) => {
    try {
      const data = await getLessonByIdApi(lessonId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "lesson/deleteLesson",
  async (lessonId, { rejectWithValue }) => {
    try {
      const data = await deleteLessonApi(lessonId);
      return { lessonId }; // ممكن ترجع ID بس عشان تشيله من الستيت
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const lessonSlice = createSlice({
  name: "lesson",
  initialState: {
    lessons: [],
    selectedLesson: null, // ده عشان نخزن الدرس اللي جيبناه بالـ id
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Lesson
      .addCase(addLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons.push(action.payload);
      })
      .addCase(addLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Lessons
      .addCase(getLessons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = action.payload;
      })
      .addCase(getLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Lesson By ID
      .addCase(getLessonById.pending, (state) => {
        state.loading = true;
        state.selectedLesson = null;
      })
      .addCase(getLessonById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLesson = action.payload;
      })
      .addCase(getLessonById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Lesson
      .addCase(deleteLesson.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.loading = false;
        state.lessons = state.lessons.filter(
          (lesson) => lesson._id !== action.payload.id
        );
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lessonSlice.reducer; // التأكد من تصدير الـ reducer بشكل صحيح
