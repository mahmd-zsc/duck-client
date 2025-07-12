import axiosInstance from "../../utils/axiosInstance";

export const addLessonGroupApi = async (groupData) => {
  try {
    console.log(groupData);
    const response = await axiosInstance.post("/lesson-groups", groupData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to add lesson group"
    );
  }
};

export const getLessonGroupsApi = async () => {
  try {
    const response = await axiosInstance.get("/lesson-groups");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch lesson groups"
    );
  }
};

export const getLessonGroupByIdApi = async (groupId) => {
  try {
    const response = await axiosInstance.get(`/lesson-groups/${groupId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch lesson group"
    );
  }
};

export const updateLessonGroupApi = async ({ groupId, groupData }) => {
  try {
    const response = await axiosInstance.put(
      `/lesson-groups/${groupId}`,
      groupData
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update lesson group"
    );
  }
};

export const deleteLessonGroupApi = async (groupId) => {
  try {
    const response = await axiosInstance.delete(`/lesson-groups/${groupId}`);
    return { groupId }; // لإزالته من الـ state لاحقًا
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete lesson group"
    );
  }
};
