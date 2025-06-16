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
    const response = await axiosInstance.get("/words"); // المسار المفترض
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في جلب الكلمات");
  }
};
