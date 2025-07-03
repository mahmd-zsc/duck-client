import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Info, BookOpen, Eye } from "lucide-react";
import { PiPottedPlantThin } from "react-icons/pi";
import { CiTimer } from "react-icons/ci";

function LessonModal({ lesson, onClose }) {
  const [groupSize, setGroupSize] = useState(5);
  const [selectedGroup, setSelectedGroup] = useState(1);
  const navigate = useNavigate();

  const totalGroups = Math.ceil(lesson.wordsNumber / groupSize);

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
      { length: 15 + Math.floor(Math.random() * 5) },
      (_, i) => ({
        id: i,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 20 + Math.random() * 40,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        opacity: 0.08 + Math.random() * 0.15,
      })
    );
  }, [lesson?.title]);

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

  // Lock page scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      onClose();
    }
  };

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="overlay fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.4)" }}
      dir="rtl"
    >
      <div className="w-[95%] sm:w-[500px] lg:w-[650px] max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-sm relative">
        {/* Background shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {shapes.map(renderShape)}
        </div>

        {/* Modal content */}
        <div className="relative z-10 p-8 py-10 flex flex-col h-full">
       

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
              <Info size={12} className="text-gray-500" />
            </div>
            <h1 className="text-base font-normal text-gray-800">
              {lesson.emoji} {lesson.title}
            </h1>
          </div>

          {/* Settings Section */}
          <div className="space-y-6 mb-8">
            {/* Group size selection */}
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-3">
                عدد الكلمات في كل مجموعة:
              </label>
              <select
                value={groupSize}
                onChange={(e) => {
                  setGroupSize(+e.target.value);
                  setSelectedGroup(1);
                }}
                className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
              >
                {[5, 10, 15, 20].map((size) => (
                  <option key={size} value={size}>
                    {size} كلمة
                  </option>
                ))}
              </select>
            </div>

            {/* Group selection */}
            <div>
              <label className="block text-sm font-normal text-gray-700 mb-3">
                اختر المجموعة ({totalGroups} مجموعة متاحة):
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {Array.from({ length: totalGroups }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGroup(i + 1)}
                    className={`px-4 py-2 rounded-2xl border text-sm font-normal transition-colors ${
                      selectedGroup === i + 1
                        ? "bg-gray-800 text-white border-gray-800"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    المجموعة {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main counter section */}
          <div className="text-center mb-8">
            <div className="mb-3">
              <span className="text-6xl font-light text-gray-900">
                {lesson.wordsNumber}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <div>كلمة في هذا الدرس</div>
              <div className="capitalize mt-1">المستوى: {lesson.level}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Learn button */}
            <button
              onClick={() => {
                navigate(
                  `/questions?lessonId=${lesson._id}&groupSize=${groupSize}&groupNumber=${selectedGroup}&mode=learn`
                );
                onClose();
              }}
              className="bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span>بدء التعلم</span>
              <span>
                <BookOpen size={20} color="blue" />
              </span>
            </button>

            {/* Review button */}
            <button
              onClick={() => {
                navigate(
                  `/questions?lessonId=${lesson._id}&groupSize=${groupSize}&groupNumber=${selectedGroup}&mode=review`
                );
                onClose();
              }}
              className="bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span>مراجعة</span>
              <span>
                <PiPottedPlantThin size={20} color="green" />
              </span>
            </button>

            {/* Quick Review button */}
            <button
              onClick={() => {
                navigate(
                  `/questions?lessonId=${lesson._id}&groupSize=${groupSize}&groupNumber=${selectedGroup}&mode=quick-review`
                );
                onClose();
              }}
              className="bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span>مراجعة سريعة</span>
              <span>
                <CiTimer size={20} color="red" />
              </span>
            </button>

            {/* Lesson Details button */}
            <button
              onClick={() => {
                navigate(`/lesson/${lesson._id}`);
                onClose();
              }}
              className="bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span>تفاصيل الدرس</span>
              <span>
                <Eye size={20} color="gray" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default LessonModal;
