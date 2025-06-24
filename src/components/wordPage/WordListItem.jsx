// components/WordListItem.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const WordListItem = ({ wordObj, isSelected, onClick, onContextMenu }) => {
  return (
    <div
      onClick={() => onClick(wordObj._id)}
      onContextMenu={(e) => onContextMenu(e, wordObj)}
      className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer select-none relative ${
        isSelected
          ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 text-white shadow-lg transform scale-[1.02]"
          : wordObj.isHard
          ? wordObj.isReviewed
            ? "bg-white border-orange-200 hover:border-orange-300 hover:shadow-md"
            : "bg-white border-red-200 hover:border-red-300 hover:shadow-md"
          : wordObj.isReviewed
          ? "bg-white border-blue-200 hover:border-blue-300 hover:shadow-md"
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Selection Checkbox */}
        <div className="flex-shrink-0">
          <div
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              isSelected
                ? "bg-white border-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {isSelected && (
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
            )}
          </div>
        </div>

        {/* Word Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div
                className={`text-xl font-semibold ${
                  isSelected
                    ? "text-white"
                    : wordObj.isHard
                    ? wordObj.isReviewed
                      ? "text-orange-700"
                      : "text-red-700"
                    : wordObj.isReviewed
                    ? "text-blue-700"
                    : "text-gray-800"
                }`}
              >
                {wordObj.word}
              </div>

              {wordObj.translation && (
                <div
                  className={`text-base ${
                    isSelected
                      ? "text-blue-100"
                      : wordObj.isHard
                      ? wordObj.isReviewed
                        ? "text-orange-600"
                        : "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {wordObj.translation}
                </div>
              )}
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-3">
              {wordObj.isReviewed && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  مراجعة
                </span>
              )}

              {wordObj.isHard && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : wordObj.isReviewed
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    صعبة
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : wordObj.isReviewed
                        ? "bg-orange-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    <AlertTriangle size={12} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Overlay */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none"></div>
      )}
    </div>
  );
};

export default WordListItem;
