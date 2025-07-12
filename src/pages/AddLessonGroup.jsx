import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLessonGroup } from "../redux/slices/lessonGroupSlice";
import { getLessons } from "../redux/slices/lessonSlice";
import { Plus } from "lucide-react";

function AddLessonGroup() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.lessonGroup);
  const { lessons } = useSelector((state) => state.lesson);
  const [success, setSuccess] = useState(false);

  // حقول النموذج
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("A1");
  const [selectedLessons, setSelectedLessons] = useState([]);

  // جلب الدروس عند تحميل الصفحة
  useEffect(() => {
    dispatch(getLessons());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLessonGroup = {
      title,
      description,
      level,
      lessons: selectedLessons,
    };

    try {
      await dispatch(addLessonGroup(newLessonGroup)).unwrap();
      setSuccess(true);
      // إعادة تعيين النموذج بعد الإضافة الناجحة
      setTitle("");
      setDescription("");
      setLevel("A1");
      setSelectedLessons([]);
    } catch (err) {
      setSuccess(false);
    }
  };

  // إدارة اختيار/إلغاء اختيار الدرس
  const handleLessonSelect = (lessonId) => {
    setSelectedLessons(
      (prev) =>
        prev.includes(lessonId)
          ? prev.filter((id) => id !== lessonId) // إلغاء الاختيار إذا كان موجودًا
          : [...prev, lessonId] // إضافة إذا لم يكن موجودًا
    );
  };

  useEffect(() => {
    document.title = "Lexi - إضافة مجموعة دروس جديدة";
  }, []);

  return (
    <div className="">
      <div className="flex flex-1" dir="rtl">
        <div className="flex-1 flex flex-col w-full p-10">
          {/* العنوان والرمز */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
              <Plus size={12} className="text-gray-500" />
            </div>
            <h1 className="text-base font-normal text-gray-800">
              إضافة مجموعة دروس جديدة
            </h1>
          </div>

          {/* رسائل الحالة */}
          {loading && (
            <div className="mb-4 text-center text-blue-500 text-sm">
              جاري حفظ المجموعة...
            </div>
          )}
          {success && (
            <div className="mb-4 text-center text-green-600 text-sm">
              تم إضافة المجموعة بنجاح!
            </div>
          )}
          {error && (
            <div className="mb-4 text-center text-red-600 text-sm">
              حدث خطأ: {error}
            </div>
          )}

          <div className="flex flex-1 flex-col justify-between">
            {/* النموذج */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* عنوان المجموعة */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  عنوان المجموعة *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="مثال: أساسيات اللغة الإنجليزية"
                />
              </div>

              {/* وصف المجموعة */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  الوصف
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="وصف مختصر للمجموعة"
                  rows={3}
                />
              </div>

              {/* المستوى */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  المستوى *
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                  required
                >
                  <option value="A1">A1 (مبتدئ)</option>
                  <option value="A2">A2 (مبتدئ متقدم)</option>
                  <option value="B1">B1 (متوسط)</option>
                  <option value="B2">B2 (متوسط متقدم)</option>
                  <option value="C1">C1 (متقدم)</option>
                  <option value="C2">C2 (إتقان)</option>
                </select>
              </div>

              {/* اختيار الدروس */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  اختر الدروس المرتبطة
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-2xl">
                  {lessons.length > 0 ? (
                    lessons.map((lesson) => (
                      <div
                        key={lesson._id}
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
                          selectedLessons.includes(lesson._id)
                            ? "bg-blue-50 border border-blue-100"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleLessonSelect(lesson._id)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLessons.includes(lesson._id)}
                          onChange={() => handleLessonSelect(lesson._id)}
                          className="mr-2 cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">
                          {lesson.title} ({lesson.level})
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      لا توجد دروس متاحة. يرجى إضافة دروس أولاً.
                    </p>
                  )}
                </div>
              </div>
            </form>

            {/* زر الإضافة */}
            <div className="mt-8">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري الإضافة..." : "إضافة المجموعة"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLessonGroup;
