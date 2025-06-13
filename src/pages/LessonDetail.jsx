import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ModalAddWord from "../components/lessonDetail/ModalAddWord";
import { getLessonById } from "../redux/slices/lessonSlice";
import DeleteLessonButton from "../components/lessonDetail/DeleteLessonButton";
import { Info, Plus, Trash2 } from "lucide-react";

function LessonDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    document.title = "Lexi - تفاصيل الدرس"; // غيّر الاسم اللي إنت عايزه
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
  }, [selectedLesson?.title]); // Use title as dependency to ensure consistency per lesson

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

  return (
    <div className="flex flex-1 h-full p-4" dir="rtl">
      <div className="flex-1 flex flex-col w-full     p-8 py-10 relative overflow-hidden">
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
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-500">تقدم المراجعة</span>
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
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center hover:bg-gray-100 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-800 mb-1">
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
