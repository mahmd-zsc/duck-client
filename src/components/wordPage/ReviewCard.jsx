// components/wordPage/ReviewCard.jsx
import React, { useMemo } from "react";
import { X, Edit3, Trash2, BookOpen, RotateCcw } from "lucide-react";

// Generate background shapes similar to EditModal
const generateShapes = (count) => {
  const shapes = [];
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: i,
      type: Math.random() > 0.5 ? "circle" : "square",
      size: Math.random() * 60 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.05 + 0.02,
      color: `hsl(${Math.random() * 360}, 50%, 60%)`,
      rotation: Math.random() * 360,
    });
  }
  return shapes;
};

const renderShape = (shape) => {
  const style = {
    position: "absolute",
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: `${shape.size}px`,
    height: `${shape.size}px`,
    opacity: shape.opacity,
    backgroundColor: shape.color,
    transform: `rotate(${shape.rotation}deg)`,
    pointerEvents: "none",
    zIndex: 1,
  };

  if (shape.type === "circle") {
    style.borderRadius = "50%";
  } else {
    style.borderRadius = "8px";
  }

  return <div key={shape.id} style={style} />;
};

const ReviewCard = ({
  wordData,
  onEdit,
  onDelete,
  onClose,
  onLearn,
  onReview,
}) => {
  const shapes = useMemo(() => generateShapes(20), []);

  // منع التمرير في الصفحة الخارجية عند فتح المودال
  React.useEffect(() => {
    // حفظ القيمة الحالية لـ overflow
    const originalOverflow = document.body.style.overflow;
    // منع التمرير
    document.body.style.overflow = "hidden";

    // إرجاع التمرير عند إغلاق المودال
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={onClose}
      style={{ touchAction: "none" }}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden border border-white/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {shapes.map(renderShape)}
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/50 flex-shrink-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {wordData.word}
          </h2>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                المعلومات الأساسية
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">المعنى:</h4>
                  <p className="text-gray-800 bg-gray-50/50 p-4 rounded-xl">
                    {wordData.meaning}
                  </p>
                </div>

                {wordData.pronunciation && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">النطق:</h4>
                    <p className="text-gray-800 bg-gray-50/50 p-4 rounded-xl">
                      {wordData.pronunciation}
                    </p>
                  </div>
                )}

                {wordData.type === "noun" && wordData.article && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">أداة التعريف:</h4>
                    <p className="text-gray-800 bg-gray-50/50 p-4 rounded-xl">
                      {wordData.article}
                    </p>
                  </div>
                )}

                {wordData.type === "noun" && wordData.plural && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">الجمع:</h4>
                    <p className="text-gray-800 bg-gray-50/50 p-4 rounded-xl">
                      {wordData.plural}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Examples Section */}
            {wordData.examples?.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  الأمثلة
                </h3>

                <div className="space-y-4">
                  {wordData.examples.map((example, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-50/50 rounded-xl space-y-2 border-l-4 border-blue-500"
                    >
                      <p className="font-medium text-gray-800">
                        {example.sentence}
                      </p>
                      <p className="text-gray-600">{example.meaning}</p>
                      {example.pronunciation && (
                        <p className="text-gray-500 text-sm">
                          {example.pronunciation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-6 border-t border-gray-200/50 bg-white/50 flex-shrink-0">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4 w-full">
              <button
                onClick={onLearn}
                className="flex-1 min-h-[50px] bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                <BookOpen size={18} />
                تعلم
              </button>

              <button
                onClick={onReview}
                className="flex-1 min-h-[50px] bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
              >
                <RotateCcw size={18} />
                مراجعة
              </button>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={onEdit}
                className="flex-1 min-h-[50px] bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                <Edit3 size={18} />
                تعديل
              </button>

              <button
                onClick={onDelete}
                className="flex-1 min-h-[50px] bg-red-100 text-red-600 py-3 px-6 rounded-xl hover:bg-red-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              >
                <Trash2 size={18} />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
