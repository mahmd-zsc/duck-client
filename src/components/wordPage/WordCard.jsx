// components/WordCard.jsx
import React from "react";
import { AlertTriangle, Star } from "lucide-react";

const WordCard = ({ wordObj, isSelected, onClick, onContextMenu }) => {
  return (
    <div
      onClick={() => onClick(wordObj._id)}
      onContextMenu={(e) => onContextMenu(e, wordObj)}
      className={`border rounded-xl p-3 text-center transition-all cursor-pointer select-none relative ${
        isSelected
          ? "bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105"
          : wordObj.isHard
          ? wordObj.isReviewed
            ? "bg-orange-50 border-orange-300 hover:bg-orange-100"
            : "bg-red-50 border-red-300 hover:bg-red-100"
          : wordObj.isReviewed
          ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
          : "bg-gray-50 border-gray-200 hover:bg-gray-100"
      }`}
    >
      {wordObj.isHard && (
        <div className="absolute -top-1 -right-1">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              isSelected
                ? "bg-white text-orange-500"
                : wordObj.isReviewed
                ? "bg-orange-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            <AlertTriangle size={10} />
          </div>
        </div>
      )}
      {wordObj.isImportant && (
        <div className="absolute -top-1 -left-1">
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              isSelected
                ? "bg-white text-yellow-500"
                : "bg-yellow-500 text-white"
            }`}
          >
            <Star size={10} />
          </div>
        </div>
      )}

      <div
        className={`text-sm font-medium mb-1 ${
          isSelected
            ? "text-white"
            : wordObj.isHard
            ? wordObj.isReviewed
              ? "text-orange-800"
              : "text-red-800"
            : wordObj.isReviewed
            ? "text-blue-800"
            : "text-gray-800"
        }`}
      >
        {wordObj.word}
      </div>
      {wordObj.translation && (
        <div
          className={`text-xs ${
            isSelected
              ? "text-blue-100"
              : wordObj.isHard
              ? wordObj.isReviewed
                ? "text-orange-600"
                : "text-red-600"
              : "text-gray-500"
          }`}
        >
          {wordObj.translation}
        </div>
      )}
    </div>
  );
};

export default WordCard;
