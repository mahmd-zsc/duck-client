import axiosInstance from "../../utils/axiosInstance";

// إضافة كلمة جديدة
export const addWordApi = async (wordData) => {
  try {
    const response = await axiosInstance.post("/words", wordData);
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

// دالة جديدة لجلب عدد الكلمات للمراجعة
export const getReviewCountApi = async () => {
  try {
    const response = await axiosInstance.get("/words/needs-review");
    return response.data.count;
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

// أضف هذه الدالة لجلب عدد الكلمات المهمة
export const getImportantWordsCountApi = async () => {
  try {
    const response = await axiosInstance.get("/words/filter/important");
    return response.data.length; // لأننا نرجع مصفوفة الكلمات المهمة
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في جلب عدد الكلمات المهمة"
    );
  }
};

// أضف هذه الدالة لجلب الكلمات المهمة
export const getImportantWordsApi = async () => {
  try {
    const response = await axiosInstance.get("/words/filter/important");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في جلب الكلمات المهمة"
    );
  }
};

export const deleteWordApi = async (wordId) => {
  try {
    const response = await axiosInstance.delete(`/words/${wordId}`);
    return response.data.message || "تم حذف الكلمة بنجاح";
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في حذف الكلمة");
  }
};

// تحديث كلمة
export const updateWordApi = async (wordId, updatedData) => {
  console.log(updatedData.examples[0]);
  console.log(wordId);
  try {
    const response = await axiosInstance.put(`/words/${wordId}`, updatedData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "فشل في تحديث الكلمة");
  }
};

// تحديد كلمات كصعبة (Batch mark as hard)
export const markWordsAsHardApi = async (wordIds) => {
  try {
    const response = await axiosInstance.patch("/words/batch/mark-hard", {
      wordIds,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في تحديد الكلمات كصعبة"
    );
  }
};

// تحديد كلمات كسهلة (Batch mark as easy)
export const markWordsAsEasyApi = async (wordIds) => {
  try {
    const response = await axiosInstance.patch("/words/batch/mark-easy", {
      wordIds,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في تحديد الكلمات كسهلة"
    );
  }
};

// أضف هذه الدالة لتحديد الكلمات كمهمة
export const markWordsAsImportantApi = async (wordIds) => {
  try {
    const response = await axiosInstance.patch("/words/batch/mark-important", {
      wordIds,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في تحديد الكلمات كمهمة"
    );
  }
};

// أضف هذه الدالة لإزالة علامة المهمة من الكلمات
export const markWordsAsUnimportantApi = async (wordIds) => {
  try {
    const response = await axiosInstance.patch(
      "/words/batch/mark-unimportant",
      { wordIds }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "فشل في إزالة علامة المهمة"
    );
  }
};
