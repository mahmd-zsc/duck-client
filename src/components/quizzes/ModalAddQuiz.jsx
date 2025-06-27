import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X, Plus, FileText } from "lucide-react";
import { createQuizApi } from "../../redux/apiCalls/quizApi";

function ModalAddQuiz({ showModal, setShowModal, rule }) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState(null);

  const handleAddQuizzes = async () => {
    try {
      const parsedQuizzes = JSON.parse(jsonInput);

      // تحقق من أن المدخل هو مصفوفة
      if (!Array.isArray(parsedQuizzes)) {
        throw new Error("يجب أن يكون المدخل مصفوفة من الأسئلة");
      }

      // تحقق من كل سؤال في المصفوفة
      for (const quiz of parsedQuizzes) {
        if (
          !quiz.question ||
          !quiz.options ||
          !quiz.answer ||
          !quiz.meaning ||
          !quiz.pronunciation
        ) {
          throw new Error(
            "كل سؤال يجب أن يحتوي على: question, options, answer, meaning, pronunciation"
          );
        }

        await createQuizApi({
          ...quiz,
          rule: rule, // تضمين القاعدة من الـ prop
          type: "translation", // تعيين النوع افتراضياً
          timesAnswered: 0, // تعيين القيم الافتراضية
        });
      }

      setJsonInput("[]");
      setShowModal(false);
      setError(null);
      window.location.reload(); // إعادة تحميل الصفحة لتحديث البيانات
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="overlay fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn bg-opacity-20"
      dir="rtl"
    >
      <div className="bg-white rounded-3xl shadow-xl w-[90%] max-w-2xl mx-4 animate-popIn overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <button
            onClick={() => setShowModal(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-gray-600" />
            <h3 className="text-lg font-medium text-gray-800">
              إضافة أسئلة ترجمة جديدة
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-blue-800 text-sm">
                <strong>القاعدة الحالية:</strong> {rule}
              </p>
              <p className="text-blue-800 text-sm mt-2">
                <strong>ملاحظة:</strong> سيتم تعيين نوع السؤال تلقائياً إلى
                "translation"
              </p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              أدخل الأسئلة (بصيغة JSON)
            </label>
            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows="12"
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm font-mono"
                placeholder={`مثال:
[
  {
    "pronunciation": "إش جيهى تسو دير بانك",
    "question": "Ich gehe ---- der Bank",
    "options": ["zu", "nach", "bei", "von"],
    "answer": "zu",
    "meaning": "أنا ذاهب إلى البنك",
    "rule": "Präpositionen"
  },
  {
    "pronunciation": "فون فيه تسو هاوز",
    "question": "Von wo ---- zu Haus?",
    "options": ["gehst", "gehe", "geht", "gehen"],
    "answer": "gehst",
    "meaning": "من أين تذهب إلى المنزل؟",
    "rule": "Verben Konjugation"
  }
]`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              تأكد من صحة تنسيق JSON وأن كل سؤال يحتوي على الحقول المطلوبة
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-white border border-gray-300 rounded-2xl py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm"
            >
              إلغاء
            </button>
            <button
              onClick={handleAddQuizzes}
              className="flex-1 bg-gray-900 text-white rounded-2xl py-3 text-sm font-normal hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              إضافة الأسئلة
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModalAddQuiz;
