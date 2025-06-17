import axiosInstance from "../../utils/axiosInstance";

export const generateQuizzesApi = async (payload) => {
  try {
    const queryParams = new URLSearchParams();
    if (payload.lessonId) queryParams.append("lessonId", payload.lessonId);
    if (payload.groupSize) queryParams.append("groupSize", payload.groupSize);
    if (payload.groupNumber)
      queryParams.append("groupNumber", payload.groupNumber);
    if (payload.mode) queryParams.append("mode", payload.mode);
    console.log(payload);
    const response = await axiosInstance.post(
      `/quizzes?${queryParams.toString()}`,
      { wordIds: payload.wordIds } // ✅ body
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حصل خطأ أثناء تحميل الكويز"
    );
  }
};
