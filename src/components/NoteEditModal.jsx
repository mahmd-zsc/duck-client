import React from "react";
import { X } from "lucide-react";

const NoteEditModal = ({
  selectedNote,
  isCreating,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  onSave,
  onDelete,
  onClose,
  noteIndex, // إضافة prop جديد لمعرفة index الملاحظة
}) => {
  if (!selectedNote && !isCreating) return null;

  // نفس ألوان الخلفيات من Notes component
  const backgroundColors = [
    "bg-yellow-50 border-yellow-200",
    "bg-pink-50 border-pink-200",
    "bg-blue-50 border-blue-200",
    "bg-green-50 border-green-200",
    "bg-purple-50 border-purple-200",
    "bg-orange-50 border-orange-200",
    "bg-teal-50 border-teal-200",
    "bg-indigo-50 border-indigo-200",
    "bg-red-50 border-red-200",
    "bg-cyan-50 border-cyan-200",
    "bg-emerald-50 border-emerald-200",
    "bg-rose-50 border-rose-200",
  ];

  const getBackgroundColor = (index) => {
    if (isCreating || index === undefined) return "bg-white"; // لون افتراضي للملاحظات الجديدة
    return backgroundColors[index % backgroundColors.length];
  };

  const handleSave = () => {
    onSave();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative border-2 ${getBackgroundColor(
          noteIndex
        )}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* زرار الإغلاق */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 hover:bg-white/50 rounded-full transition-colors"
        >
          <X size={24} className="text-gray-500" />
        </button>

        {/* منطقة الكتابة الكاملة */}
        <div className="h-full p-8 pt-20">
          <textarea
            value={editContent || ""}
            onChange={(e) => setEditContent(e.target.value)}
            onBlur={handleSave}
            placeholder="ابدأ الكتابة..."
            className="w-full h-full border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-xl leading-loose"
            style={{
              fontFamily:
                "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              direction: "rtl",
            }}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditModal;
