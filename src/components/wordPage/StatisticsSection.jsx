// components/StatisticsSection.jsx
import React from "react";

const StatisticsSection = ({
  searchTerm,
  filteredWordsCount,
  totalWordsCount,
  hardWordsCount,
  selectedWordsCount,
  reviewedPercentage,
}) => {
  return (
    <div className="mb-8 relative">
      <div className="text-center mb-6">
        <div className="mb-3">
          <span className="text-6xl font-light text-gray-900">
            {searchTerm ? filteredWordsCount : totalWordsCount}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          <div>{searchTerm ? "كلمة في نتائج البحث" : "كلمة في المجموع"}</div>
          {hardWordsCount > 0 && !searchTerm && (
            <div className="mt-1 text-orange-600 font-medium">
              {hardWordsCount} كلمة صعبة
            </div>
          )}
          {selectedWordsCount > 0 && (
            <div className="mt-1 text-blue-600 font-medium absolute left-1/2 -translate-x-1/2">
              {selectedWordsCount} كلمة محددة
            </div>
          )}
        </div>
      </div>

      {!searchTerm && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">الكلمات المراجعة</span>
            <span className="text-xs font-medium text-gray-800">
              {reviewedPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gray-800 transition-all duration-700"
              style={{ width: `${reviewedPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatisticsSection;
