import { useState, useMemo } from "react";
import { Info } from "lucide-react";

function LessonCard({ title, level, wordsNumber, onClick }) {
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
      { length: 3 + Math.floor(Math.random() * 3) },
      (_, i) => ({
        id: i,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 20 + Math.random() * 40,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        opacity: 0.3 + Math.random() * 0.4,
      })
    );
  }, [title]); // Use title as dependency to ensure consistency per card

  const renderShape = (shape) => {
    const baseStyle = {
      position: "absolute",
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      transform: `translate(-50%, -50%) rotate(${shape.rotation}deg)`,
      opacity: shape.opacity,
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

  return (
    <button
      onClick={onClick}
      className="relative w-full h-[150px] sm:h-[160px] md:h-[180px] lg:h-[190px] overflow-hidden rounded-3xl p-6 text-start bg-white shadow-sm   hover:shadow-md transition-all duration-300 "
      dir="rtl"
    >
      {/* Background Shapes */}
      <div className="absolute inset-0 z-10">{shapes.map(renderShape)}</div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col justify-between h-full">
        {/* Header with info icon */}
        <div className="flex items-center justify-between">
          <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <Info size={8} className="text-gray-500" />
          </div>
          <span className="text-xs font-normal text-gray-700 uppercase bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
            {level}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-between">
          {/* Title */}
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-normal text-gray-800 leading-tight bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg inline-block">
              {title}
            </h3>
          </div>

          {/* Words count display */}
          <div className="text-right bg-white/80 backdrop-blur-sm px-3 py-2 rounded-xl">
            <div className="text-2xl sm:text-3xl font-light text-gray-900">
              {wordsNumber}
            </div>
            <div className="text-xs text-gray-500 mt-1">كلمة</div>
          </div>
        </div>

        {/* Action indicator */}
        <div className="flex justify-end">
          <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </button>
  );
}

export default LessonCard;
