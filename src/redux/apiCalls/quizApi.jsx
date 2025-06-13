import axiosInstance from "../../utils/axiosInstance";

export const generateQuizzesApi = async ({
  lessonId,
  groupSize,
  groupNumber,
  mode,
}) => {
  try {
    let response;

    if (lessonId) {
      response = await axiosInstance.get(
        `/quizzes?lessonId=${lessonId}&groupSize=${groupSize}&groupNumber=${groupNumber}&mode=${mode}`
      );
    } else {
      response = await axiosInstance.get(
        `/quizzes?groupSize=${groupSize}&groupNumber=${groupNumber}&mode=${mode}`
      );
    }

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حصل خطأ أثناء تحميل الكويز"
    );
  }
};
