import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Info, X } from "lucide-react";

function QuizModal({
  quizRule,
  onClose,
  setShowAddQuizModal,
  setSelectedRule,
}) {
  const [groupSize, setGroupSize] = useState(5);
  const [selectedGroup, setSelectedGroup] = useState(1);
  const navigate = useNavigate();

  const totalGroups = Math.ceil(quizRule.count / groupSize);

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
  }, [quizRule?.rule]);

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
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

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

  const handleAddQuestions = () => {
    setSelectedRule(quizRule.rule);
    setShowAddQuizModal(true);
    onClose();
  };

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="overlay fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.4)" }}
      dir="rtl"
    >
      <div className="w-[95%] sm:w-[500px] lg:w-[600px] max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-2xl relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {shapes.map(renderShape)}
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>

          <div className="flex items-center justify-between mb-8">
            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
              <Info size={12} className="text-gray-500" />
            </div>
            <div className="text-center flex-1 mx-4">
              <h2 className="text-lg font-medium text-gray-800 mb-1">
                {quizRule.rule}
              </h2>
              <p className="text-sm text-gray-500">قاعدة نحوية/لغوية</p>
            </div>
            <div className="w-6"></div>
          </div>

          <div className="text-center mb-8">
            <div className="mb-3">
              <span className="text-5xl sm:text-6xl font-light text-gray-900">
                {quizRule.count}
              </span>
            </div>
            <div className="text-sm text-gray-500">سؤال لهذه القاعدة</div>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                عدد الأسئلة في كل مجموعة:
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
                    {size} سؤال
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                اختر المجموعة ({totalGroups} مجموعة متاحة):
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {Array.from({ length: totalGroups }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedGroup(i + 1)}
                    className={`px-4 py-2 rounded-2xl border text-sm font-medium transition-colors ${
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

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddQuestions}
              className="flex-1 bg-blue-600 text-white rounded-2xl py-4 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              إضافة أسئلة جديدة
            </button>
            <button
              onClick={() => {
                navigate(
                  `/questions?rule=${encodeURIComponent(
                    quizRule.rule
                  )}&groupSize=${groupSize}&groupNumber=${selectedGroup}`
                );
                onClose();
              }}
              className="flex-1 bg-gray-800 text-white rounded-2xl py-4 text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm"
            >
              بدء الحل
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default QuizModal;
