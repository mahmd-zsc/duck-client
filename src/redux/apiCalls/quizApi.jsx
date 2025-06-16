import axiosInstance from "../../utils/axiosInstance";

export const generateQuizzesApi = async ({
  lessonId,
  groupSize,
  groupNumber,
  mode,
  wordIds = [],
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (lessonId) queryParams.append("lessonId", lessonId);
    if (groupSize) queryParams.append("groupSize", groupSize);
    if (groupNumber) queryParams.append("groupNumber", groupNumber);
    if (mode) queryParams.append("mode", mode);

    // ✅ إضافة wordIds لو موجودة
    if (wordIds.length > 0) {
      queryParams.append("wordIds", wordIds.join(","));
    }

    const response = await axiosInstance.get(
      `/quizzes?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حصل خطأ أثناء تحميل الكويز"
    );
  }
};
