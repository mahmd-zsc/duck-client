import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Info } from "lucide-react";

const Words = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Lexi - قائمة الكلمات"; // غيّر الاسم اللي إنت عايزه
  }, []);

  // Generate random shapes and colors (same as LessonDetail)
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

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const res = await axiosInstance.get("/words");
        const sorted = res.data.sort((a, b) => a.word.localeCompare(b.word));
        setWords(sorted);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء تحميل الكلمات");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

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

  // Calculate statistics
  const reviewedWords = words.filter((word) => word.isReviewed).length;
  const reviewedPercentage =
    words.length > 0 ? Math.round((reviewedWords / words.length) * 100) : 0;

  return (
    <div className="flex flex-1 h-full p-4" dir="rtl">
      <div className="flex-1 flex flex-col w-full p-8 py-10 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute inset-0 pointer-events-none">
          {shapes.map(renderShape)}
        </div>

        {/* Header with info icon and title */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">قائمة الكلمات</h1>
        </div>

        <div className="flex flex-1 flex-col relative z-10">
          {/* Statistics section */}
          <div className="mb-8">
            {/* Word count display */}
            <div className="text-center mb-6">
              <div className="mb-3">
                <span className="text-6xl font-light text-gray-900">
                  {words.length}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <div>كلمة في المجموع</div>
              </div>
            </div>

            {/* Progress bar */}
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

          {/* Words grid */}
          <div className="flex-1 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {words.map((wordObj) => (
                <div
                  key={wordObj._id}
                  className={`border rounded-xl p-3 text-center transition-colors ${
                    wordObj.isReviewed
                      ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      wordObj.isReviewed ? "text-blue-800" : "text-gray-800"
                    }`}
                  >
                    {wordObj.word}
                  </div>
                  {wordObj.translation && (
                    <div className="text-xs text-gray-500">
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
