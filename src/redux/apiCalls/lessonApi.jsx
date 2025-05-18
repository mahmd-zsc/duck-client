import axiosInstance from "../../utils/axiosInstance";

// دالة لإضافة درس جديد
export const addLessonApi = async (lessonData) => {
  try {
    const response = await axiosInstance.post("/lessons", lessonData); // نستخدم الـ axios instance هنا
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

// دالة لجلب الدروس
export const getLessonsApi = async () => {
  try {
    const response = await axiosInstance.get("/lessons"); // نستخدم الـ axios instance هنا
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch lessons");
  }
};

export const getLessonByIdApi = async (lessonId) => {
  try {
    const response = await axiosInstance.get(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch lesson by ID"
    );
  }
};

export const deleteLessonApi = async (lessonId) => {
  try {
    const response = await axiosInstance.delete(`/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete lesson");
  }
};
