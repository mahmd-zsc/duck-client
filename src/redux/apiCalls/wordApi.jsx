import axiosInstance from "../../utils/axiosInstance";

// إضافة كلمة جديدة
export const addWordApi = async (wordData) => {
  try {
    const response = await axiosInstance.post("/words", wordData); // wordData = { ...word, lessonId }
    console.log("✔");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Something went wrong");
  }
};

// جلب كل الكلمات
export const getAllWordsApi = async () => {
  try {
    const response = await axiosInstance.get("/words");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في جلب الكلمات");
  }
};

// ✅ دالة جديدة لجلب عدد الكلمات للمراجعة
export const getReviewCountApi = async () => {
  try {
    const response = await axiosInstance.get("/words/needs-review");
    return response.data.count; // رجع العدد بس
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في جلب عدد المراجعة");
  }
};

export const getHardWordsCountApi = async () => {
  try {
    const response = await axiosInstance.get("/words/hard/count");
    return response.data.count;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في جلب عدد الكلمات الصعبة"
    );
  }
};
