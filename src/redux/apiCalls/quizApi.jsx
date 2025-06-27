import axiosInstance from "../../utils/axiosInstance";

// توليد كويزات تلقائي
export const generateQuizzesApi = async (payload) => {
  try {
    const queryParams = new URLSearchParams();
    if (payload.lessonId) queryParams.append("lessonId", payload.lessonId);
    if (payload.groupSize) queryParams.append("groupSize", payload.groupSize);
    if (payload.groupNumber)
      queryParams.append("groupNumber", payload.groupNumber);
    if (payload.mode) queryParams.append("mode", payload.mode);

    const response = await axiosInstance.post(
      `/quizzes?${queryParams.toString()}`,
      { wordIds: payload.wordIds }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "حصل خطأ أثناء تحميل الكويز"
    );
  }
};

// إنشاء كويز جديد
export const createQuizApi = async (quizData) => {
  try {
    const response = await axiosInstance.post("/quizzes/create", quizData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في إنشاء الكويز");
  }
};

// إنشاء عدة كويزات دفعة واحدة
export const createManyQuizzesApi = async (quizzesData) => {
  try {
    const response = await axiosInstance.post("/quizzes/bulk", quizzesData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في إنشاء الكويزات");
  }
};

// جلب جميع الكويزات
export const getAllQuizzesApi = async (params = {}) => {
  try {
    const response = await axiosInstance.get("/quizzes/all", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في جلب الكويزات");
  }
};

// جلب كويز بواسطة ID
export const getQuizByIdApi = async (quizId) => {
  try {
    const response = await axiosInstance.get(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في جلب الكويز");
  }
};

// تحديث كويز
export const updateQuizApi = async (quizId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/quizzes/${quizId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في تحديث الكويز");
  }
};

// حذف كويز
export const deleteQuizApi = async (quizId) => {
  try {
    const response = await axiosInstance.delete(`/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في حذف الكويز");
  }
};

// جلب جميع القواعد مع عدد الأسئلة
export const getQuizRulesApi = async () => {
  try {
    const response = await axiosInstance.get("/quizzes/rules");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching quiz rules:", error);
    throw new Error(
      error.response?.data?.message ||
        "تعذر تحميل قواعد الأسئلة. يرجى التأكد من اتصال الإنترنت والمحاولة لاحقاً"
    );
  }
};

// جلب عدد الكويزات التي تحتاج مراجعة
export const getNeedsReviewCountApi = async () => {
  try {
    const response = await axiosInstance.get("/quizzes/needs-review/count");
    return response.data.count;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "فشل في جلب عدد الكويزات التي تحتاج مراجعة"
    );
  }
};

// جلب عدد الكويزات الصعبة
export const getHardQuizzesCountApi = async () => {
  try {
    const response = await axiosInstance.get("/quizzes/hard/count");
    return response.data.count;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في جلب عدد الكويزات الصعبة"
    );
  }
};

export const getRandomMixedQuizzesApi = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/quizzes/random/mixed-rules?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching random mixed quizzes:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to load random quizzes. Please try again later."
    );
  }
};
