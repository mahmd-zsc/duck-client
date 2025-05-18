import axiosInstance from "../../utils/axiosInstance";

// utils/api.js
export const addWordApi = async (wordData) => {
  try {
    const response = await axiosInstance.post("/words", wordData); // wordData = { ...word, lessonId }
    console.log("gg");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};
