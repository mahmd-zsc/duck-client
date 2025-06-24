import { createSlice } from "@reduxjs/toolkit";
import {
  getAllNotesApi,
  createNoteApi,
  deleteNoteApi,
  updateNoteApi,
} from "../apiCalls/noteApi";

const initialState = {
  notes: [],
  loading: false,
  error: null,
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    setNotes: (state, action) => {
      state.notes = action.payload;
      state.loading = false;
      state.error = null;
    },
    addNote: (state, action) => {
      state.notes.push(action.payload);
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter((note) => note._id !== action.payload);
    },
    updateNote: (state, action) => {
      const index = state.notes.findIndex((n) => n._id === action.payload._id);
      if (index !== -1) {
        state.notes[index] = action.payload;
      }
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

// 👉 Thunk Functions
export const fetchNotes = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    const notes = await getAllNotesApi();
    dispatch(setNotes(notes));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const createNote = (payload) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const newNote = await createNoteApi(payload);
    dispatch(addNote(newNote));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const removeNote = (id) => async (dispatch) => {
  try {
    await deleteNoteApi(id);
    dispatch(deleteNote(id));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const editNote = (id, updatedData) => async (dispatch) => {
  try {
    const updatedNote = await updateNoteApi(id, updatedData);
    dispatch(updateNote(updatedNote));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const {
  setNotes,
  addNote,
  deleteNote,
  updateNote,
  setLoading,
  setError,
} = noteSlice.actions;

export default noteSlice.reducer;
