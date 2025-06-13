import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLesson } from "../redux/slices/lessonSlice";
import { Info, Plus } from "lucide-react";

function AddLesson() {


  const dispatch = useDispatch();



  const { loading, error } = useSelector((state) => state.lesson);
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("beginner");
  const [emoji, setEmoji] = useState("");
  const [color, setColor] = useState("#4287f5");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLesson = {
      title,
      level,
      emoji,
      color,
    };

    try {
      await dispatch(addLesson(newLesson)).unwrap();
      setSuccess(true);
      // Reset form after successful submission
      setTitle("");
      setLevel("beginner");
      setEmoji("");
      setColor("#4287f5");
    } catch (err) {
      setSuccess(false);
    }
  };

  useEffect(() => {
    document.title = "Lexi - اضافة درس جديد"; // غيّر الاسم اللي إنت عايزه
  }, []);

  return (
    <div className="  ">
      <div className="flex flex-1" dir="rtl">
        <div className="flex-1 flex flex-col w-full     p-10">
          {/* Header with info icon and title */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
              <Plus size={12} className="text-gray-500" />
            </div>
            <h1 className="text-base font-normal text-gray-800">
              إضافة درس جديد
            </h1>
          </div>

          {/* Status Messages */}
          {loading && (
            <div className="mb-4 text-center text-blue-500 text-sm">
              جاري حفظ الدرس...
            </div>
          )}

          {success && (
            <div className="mb-4 text-center text-green-600 text-sm">
              تم إضافة الدرس بنجاح!
            </div>
          )}

          {error && (
            <div className="mb-4 text-center text-red-600 text-sm">
              حصلت مشكلة: {error}
            </div>
          )}

          <div className="flex flex-1 flex-col justify-between">
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* العنوان */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  عنوان الدرس
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="اكتب عنوان الدرس"
                />
              </div>

              {/* المستوى */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  المستوى
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                >
                  <option value="beginner">مبتدئ</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">متقدم</option>
                </select>
              </div>

              {/* الإيموجي */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  رمز تعبيري (Emoji)
                </label>
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="اكتب رمز (مثلاً: 🍎)"
                />
              </div>

              {/* اللون */}
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  اللون
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full p-3 border border-gray-300 bg-white rounded-2xl transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer h-12"
                />
              </div>
            </form>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري الإضافة..." : "إضافة الدرس"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLesson;
