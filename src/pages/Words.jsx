import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info, X, Eye, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllWordsApi } from "../redux/apiCalls/wordApi";
import {
  setWordIds,
  clearWordIds,
  setAllWords,
} from "../redux/slices/wordSlice";

const Words = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const words = useSelector((state) => state.word.allWords);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Lexi - قائمة الكلمات";

    const fetchWords = async () => {
      try {
        const res = await getAllWordsApi();
        dispatch(setAllWords(res)); // ✅ حسب شكل البيانات الراجعة
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل الكلمات");
      } finally {
        setLoading(false);
      }
    };
    if (words.length < 1) {
      fetchWords();
    }
  }, [dispatch]);

  const shapes = useMemo(() => {
    const colors = [
      "bg-blue-200",
      "bg-green-200",
      "bg-yellow-200",
      "bg-pink-200",
      "bg-purple-200",
      "bg-indigo-200",
      "bg-red-200",
      "bg-orange-200",
      "bg-teal-200",
      "bg-cyan-200",
    ];
    const shapeTypes = ["circle", "square", "triangle"];

    return Array.from(
      { length: 20 + Math.floor(Math.random() * 5) },
      (_, i) => ({
        id: i,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 30 + Math.random() * 60,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        opacity: 0.1 + Math.random() * 0.2,
      })
    );
  }, []);

  const renderShape = (shape) => {
    const baseStyle = {
      position: "absolute",
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
      opacity: shape.opacity,
      zIndex: 0,
    };

    switch (shape.type) {
      case "circle":
        return (
          <div
            key={shape.id}
            className={`${shape.color} rounded-full`}
            style={baseStyle}
          />
        );
      case "square":
        return (
          <div
            key={shape.id}
            className={`${shape.color} rounded-lg`}
            style={baseStyle}
          />
        );
      case "triangle":
        return (
          <div
            key={shape.id}
            className={`${shape.color}`}
            style={{
              ...baseStyle,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
        );
      default:
        return null;
    }
  };

  const handleWordClick = (wordId) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      newSet.has(wordId) ? newSet.delete(wordId) : newSet.add(wordId);
      return newSet;
    });
  };

  const handleCancel = () => {
    setSelectedWords(new Set());
  };

  const handleReview = () => {
    const selectedWordIds = Array.from(selectedWords);
    dispatch(setWordIds(selectedWordIds));
    setSelectedWords(new Set());
    navigate("/questions?mode=review");
  };

  const handleClearStore = () => {
    dispatch(clearWordIds());
    console.log("تم مسح wordIds من الـ store");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const reviewedWords = words.filter((word) => word.isReviewed).length;
  const hardWords = words.filter((word) => word.isHard).length;
  const reviewedPercentage =
    words.length > 0 ? Math.round((reviewedWords / words.length) * 100) : 0;

  return (
    <div className="relative flex flex-1 h-full p-4" dir="rtl">
      <div className="flex-1 flex flex-col w-full p-8 py-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {shapes.map(renderShape)}
        </div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">قائمة الكلمات</h1>
        </div>

        {selectedWords.size > 0 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex justify-center gap-4 mb-6 z-40">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
            >
              <X size={16} /> إلغاء ({selectedWords.size})
            </button>
            <button
              onClick={handleReview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
            >
              <Eye size={16} /> مراجعة
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col relative z-10">
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="mb-3">
                <span className="text-6xl font-light text-gray-900">
                  {words.length}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <div>كلمة في المجموع</div>
                {hardWords > 0 && (
                  <div className="mt-1 text-orange-600 font-medium">
                    {hardWords} كلمة صعبة
                  </div>
                )}
              </div>
            </div>

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
          </div>

          <div className="flex-1 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {words.map((wordObj) => (
                <div
                  key={wordObj._id}
                  onClick={() => handleWordClick(wordObj._id)}
                  className={`border rounded-xl p-3 text-center transition-all cursor-pointer select-none relative ${
                    selectedWords.has(wordObj._id)
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
                          selectedWords.has(wordObj._id)
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

                  <div
                    className={`text-sm font-medium mb-1 ${
                      selectedWords.has(wordObj._id)
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
                        selectedWords.has(wordObj._id)
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Words;
