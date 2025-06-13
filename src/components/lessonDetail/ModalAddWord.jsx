import React, { useState } from "react";
import { addWordApi } from "../../redux/apiCalls/wordApi";
import { createPortal } from "react-dom";
import { X, Plus, FileText } from "lucide-react";

function ModalAddWord({ showModal, setShowModal, lessonId }) {
  const [jsonInput, setJsonInput] = useState(""); // حقل لتخزين JSON المدخل
  const [error, setError] = useState(null); // لتخزين رسائل الخطأ

  const handleAddWords = async () => {
    try {
      const parsedWords = JSON.parse(jsonInput);

      for (const word of parsedWords) {
        await addWordApi({ ...word, lessonId });
      }
      console.log(error);
      setJsonInput("[]");
      setShowModal(false);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
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
      className="overlay fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn   bg-opacity-20"
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
              إضافة كلمات متعددة
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              أدخل الكلمات (بصيغة JSON)
            </label>
            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows="10"
                className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm font-mono"
                placeholder={`مثال:
[
  {
    "word": "Haus",
    "meaning": "منزل",
    "pronunciation": "هاوس"
  },
  {
    "word": "Buch",
    "meaning": "كتاب",
    "pronunciation": "بوخ"
  }
]`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              تأكد من صحة تنسيق JSON قبل الإضافة
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
              onClick={handleAddWords}
              className="flex-1 bg-gray-900 text-white rounded-2xl py-3 text-sm font-normal hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              إضافة الكلمات
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModalAddWord;
