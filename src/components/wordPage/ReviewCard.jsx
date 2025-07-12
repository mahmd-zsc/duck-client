// components/wordPage/ReviewCard.jsx
import React from "react";
import { X, Edit3, Trash2, BookOpen, RotateCcw } from "lucide-react";
import { Star, StarOff } from "lucide-react";

const ReviewCard = ({
  wordData,
  onEdit,
  onDelete,
  onClose,
  onMarkImportant,
  onMarkUnimportant,
}) => {
  React.useEffect(() => {
    // حفظ القيمة الحالية لـ overflow
    const originalOverflow = document.body.style.overflow;
    // منع التمرير
    document.body.style.overflow = "hidden";

    // إرجاع التمرير عند إغلاق المودال
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={onClose}
      style={{ touchAction: "none" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden border border-gray-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <X
              size={12}
              className="text-gray-500 cursor-pointer"
              onClick={onClose}
            />
          </div>
          <h1 className="text-base font-normal text-gray-800">
            {wordData.word}
          </h1>
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <BookOpen size={12} className="text-gray-500" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  المعنى
                </label>
                <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                  {wordData.meaning}
                </div>
              </div>

              {wordData.pronunciation && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    النطق
                  </label>
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    {wordData.pronunciation}
                  </div>
                </div>
              )}

              {wordData.type === "noun" && wordData.article && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    أداة التعريف
                  </label>
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    {wordData.article}
                  </div>
                </div>
              )}

              {wordData.type === "noun" && wordData.plural && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    الجمع
                  </label>
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    {wordData.plural}
                  </div>
                </div>
              )}
            </div>

            {/* Examples Section */}
            {wordData.examples?.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  الأمثلة
                </label>

                <div className="space-y-3">
                  {wordData.examples.map((example, index) => (
                    <div key={index} className="space-y-2">
                      <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                        <p className="font-medium mb-1">{example.sentence}</p>
                        <p className="text-gray-600">{example.meaning}</p>
                        {example.pronunciation && (
                          <p className="text-gray-500 text-xs mt-1">
                            {example.pronunciation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4 w-full">
              <button
                onClick={
                  wordData.isImportant ? onMarkUnimportant : onMarkImportant
                }
                className="flex-1 bg-white border border-gray-300 rounded-2xl py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {wordData.isImportant ? (
                  <>
                    <StarOff size={16} />
                    إزالة الأهمية
                  </>
                ) : (
                  <>
                    <Star size={16} />
                    تحديد كمهمة
                  </>
                )}
              </button>

              <button
                onClick={onEdit}
                className="flex-1 bg-white border border-gray-300 rounded-2xl py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Edit3 size={16} />
                تعديل
              </button>

              <button
                onClick={onDelete}
                className="flex-1 bg-white border border-gray-300 rounded-2xl py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
