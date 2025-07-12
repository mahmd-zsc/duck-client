import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addLessonGroupApi,
  getLessonGroupsApi,
  getLessonGroupByIdApi,
  updateLessonGroupApi,
  deleteLessonGroupApi,
} from "../apiCalls/lessonGroupApi";

// Thunks للعمليات غير المتزامنة
export const addLessonGroup = createAsyncThunk(
  "lessonGroup/addLessonGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const data = await addLessonGroupApi(groupData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLessonGroups = createAsyncThunk(
  "lessonGroup/getLessonGroups",
  async (_, { rejectWithValue }) => {
    try {
      const data = await getLessonGroupsApi();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLessonGroupById = createAsyncThunk(
  "lessonGroup/getLessonGroupById",
  async (groupId, { rejectWithValue }) => {
    try {
      const data = await getLessonGroupByIdApi(groupId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLessonGroup = createAsyncThunk(
  "lessonGroup/updateLessonGroup",
  async ({ groupId, groupData }, { rejectWithValue }) => {
    try {
      const data = await updateLessonGroupApi({ groupId, groupData });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLessonGroup = createAsyncThunk(
  "lessonGroup/deleteLessonGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      await deleteLessonGroupApi(groupId);
      return { groupId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice definition
const lessonGroupSlice = createSlice({
  name: "lessonGroup",
  initialState: {
    groups: [],
    selectedGroup: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add Lesson Group
      .addCase(addLessonGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(addLessonGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(addLessonGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All Lesson Groups
      .addCase(getLessonGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getLessonGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(getLessonGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Lesson Group By ID
      .addCase(getLessonGroupById.pending, (state) => {
        state.loading = true;
        state.selectedGroup = null;
      })
      .addCase(getLessonGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGroup = action.payload;
      })
      .addCase(getLessonGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Lesson Group
      .addCase(updateLessonGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateLessonGroup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex(
          (group) => group._id === action.payload._id
        );
        if (index !== -1) {
          state.groups[index] = action.payload;
        }
      })
      .addCase(updateLessonGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Lesson Group
      .addCase(deleteLessonGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteLessonGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter(
          (group) => group._id !== action.payload.groupId
        );
      })
      .addCase(deleteLessonGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default lessonGroupSlice.reducer;
