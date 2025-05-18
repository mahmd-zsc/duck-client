import axios from "axios";

// إنشاء axios instance مع الإعدادات المشتركة
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1", // هنا بتحدد الـ URL الأساسي للـ API
  headers: {
    "Content-Type": "application/json", // تأكد من أن Content-Type هو JSON
    // ممكن تضيف أي Headers تانية هنا زي التوكن لو كنت بتستخدم Authorization
  },
});

// لو محتاج تضيف interceptors (لتعديل الطلبات أو الاستجابات قبل الوصول للكود)
axiosInstance.interceptors.request.use(
  (config) => {
    // لو محتاج تضيف توكن أو هيدرز قبل إرسال الطلب
    const token = localStorage.getItem("authToken"); // مثال لتخزين التوكن في localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ممكن كمان تضيف interceptors للاستجابة
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // التعامل مع الخطأ لو حصل Unauthorized مثلاً
      console.log("Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
