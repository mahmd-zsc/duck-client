import axiosInstance from "../../utils/axiosInstance";

export const getAllNotesApi = async () => {
  const response = await axiosInstance.get("/notes");
  return response.data;
};

export const createNoteApi = async (noteData) => {
  const response = await axiosInstance.post("/notes", noteData);
  return response.data;
};

export const deleteNoteApi = async (noteId) => {
  const response = await axiosInstance.delete(`/notes/${noteId}`);
  return response.data;
};

export const updateNoteApi = async (noteId, updatedData) => {
  const response = await axiosInstance.put(`/notes/${noteId}`, updatedData);
  return response.data;
};
