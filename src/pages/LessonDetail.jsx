import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ModalAddWord from "../components/lessonDetail/ModalAddWord";
import { getLessonById } from "../redux/slices/lessonSlice";
import { setWordIds, clearWordIds } from "../redux/slices/wordSlice"; // ✅ استيراد الـ actions
import DeleteLessonButton from "../components/lessonDetail/DeleteLessonButton";
import { Info, Plus, Trash2, X, Eye, AlertTriangle } from "lucide-react";

function LessonDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ إضافة useNavigate
  const [showModal, setShowModal] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [selectedWords, setSelectedWords] = useState(new Set()); // ✅ إضافة state للكلمات المختارة

  useEffect(() => {
    document.title = "Lexi - تفاصيل الدرس";
  }, []);

  const { selectedLesson, loading, error } = useSelector(
    (state) => state.lesson
  );

  // Generate random shapes and colors
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
      { length: 10 + Math.floor(Math.random() * 5) },
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
  }, [selectedLesson?.title]);

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
    dispatch(getLessonById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedLesson) {
      setProgressPercent(selectedLesson.reviewedPercentage);
    }
  }, [selectedLesson]);

  // ✅ Handle word selection
  const handleWordClick = (wordId) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(wordId)) {
        newSet.delete(wordId);
      } else {
        newSet.add(wordId);
      }
      return newSet;
    });
  };

  // ✅ Handle cancel selection
  const handleCancel = () => {
    setSelectedWords(new Set());
  };

  // ✅ Handle review functionality
  const handleReview = async () => {
    try {
      const selectedWordIds = Array.from(selectedWords);
      dispatch(setWordIds(selectedWordIds));

      setSelectedWords(new Set());

      // ✅ التوجيه إلى صفحة الأسئلة
      navigate("/questions?mode=review");

      console.log("تم حفظ الكلمات المختارة في الـ store:", selectedWordIds);
    } catch (err) {
      console.error("Error updating review status:", err);
    }
  };

  // ✅ دالة لمسح wordIds من الـ store (اختيارية)
  const handleClearStore = () => {
    dispatch(clearWordIds());
    console.log("تم مسح wordIds من الـ store");
  };

  if (loading || !selectedLesson) {
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

  // ✅ Calculate statistics
  const reviewedWords = selectedLesson.words.filter(
    (word) => word.isReviewed
  ).length;
  const hardWords = selectedLesson.words.filter((word) => word.isHard).length;

  return (
    <div className="relative flex flex-1 h-full p-4" dir="rtl">
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
          <h1 className="text-base font-normal text-gray-800">
            {selectedLesson.title}
          </h1>
        </div>

        {/* ✅ Action buttons - show when words are selected */}
        {selectedWords.size > 0 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex justify-center gap-4 mb-6 z-40">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              <X size={16} />
              إلغاء ({selectedWords.size})
            </button>
            <button
              onClick={handleReview}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
            >
              <Eye size={16} />
              مراجعة
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col relative z-10">
          {/* Progress and count section */}
          <div className="mb-8">
            {/* Word count display */}
            <div className="text-center mb-6">
              <div className="mb-3">
                <span className="text-6xl font-light text-gray-900">
                  {selectedLesson.wordsNumber}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <div>كلمة في هذا الدرس</div>
                {/* ✅ إضافة عرض الكلمات الصعبة */}
                {hardWords > 0 && (
                  <div className="mt-1 text-orange-600 font-medium">
                    {hardWords} كلمة صعبة
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">الكلمات المراجعة</span>
                <span className="text-xs font-medium text-gray-800">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gray-800 transition-all duration-700"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Words grid */}
          <div className="flex-1 mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {selectedLesson.words.map((wordObj, index) => (
                <div
                  key={wordObj._id || index}
                  onClick={() => handleWordClick(wordObj._id || index)}
                  className={`border rounded-xl p-3 text-center transition-all cursor-pointer select-none relative ${
                    selectedWords.has(wordObj._id || index)
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
                  {/* ✅ Hard word indicator */}
                  {wordObj.isHard && (
                    <div className="absolute -top-1 -right-1">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          selectedWords.has(wordObj._id || index)
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
                      selectedWords.has(wordObj._id || index)
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
                        selectedWords.has(wordObj._id || index)
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

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-3 mt-auto">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              إضافة كلمة جديدة
            </button>
            <DeleteLessonButton
              lessonId={selectedLesson._id}
              className="flex-1 bg-white border border-red-300 rounded-2xl py-4 text-red-600 text-sm font-normal hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              حذف الدرس
            </DeleteLessonButton>
          </div>
        </div>

        {/* Modal */}
        <ModalAddWord
          showModal={showModal}
          lessonId={selectedLesson._id}
          setShowModal={setShowModal}
        />
      </div>
    </div>
  );
}

export default LessonDetail;
