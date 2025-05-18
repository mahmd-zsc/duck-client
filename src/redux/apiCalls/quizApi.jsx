import axiosInstance from "../../utils/axiosInstance";

export const generateQuizzesApi = async ({
  lessonId,
  groupSize,
  groupNumber,
}) => {
  try {
    const response = await axiosInstance.get(
      `/quizzes?lessonId=${lessonId}&groupSize=${groupSize}&groupNumber=${groupNumber}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حصل خطأ أثناء تحميل الكويز"
    );
  }
};
