import React from "react";
import { X, Zap, Eye, BookOpen, Star, StarOff } from "lucide-react";

const ActionButtons = ({
  selectedCount,
  onCancel,
  onQuickReview,
  onReview,
  onLearn,
  onMarkImportant,
  onMarkUnimportant,
  hasImportantSelected,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="absolute top-10 left-1/2 -translate-x-1/2 flex justify-center gap-2 mb-6 z-40">
      <button
        onClick={onCancel}
        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm"
      >
        <X size={14} /> إلغاء ({selectedCount})
      </button>

      {hasImportantSelected ? (
        <button
          onClick={onMarkUnimportant}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-800 text-sm"
        >
          <StarOff size={14} /> إزالة الأهمية
        </button>
      ) : (
        <button
          onClick={onMarkImportant}
          className="flex items-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-white text-sm"
        >
          <Star size={14} /> تحديد كمهمة
        </button>
      )}

      <button
        onClick={onQuickReview}
        className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm"
      >
        <Zap size={14} /> مراجعة سريعة
      </button>
      <button
        onClick={onReview}
        className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
      >
        <Eye size={14} /> مراجعة
      </button>
      <button
        onClick={onLearn}
        className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm"
      >
        <BookOpen size={14} /> تعلم
      </button>
    </div>
  );
};

export default ActionButtons;
