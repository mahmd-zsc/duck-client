import React from "react";
import { X, Save, Trash2 } from "lucide-react";

const NoteEditModal = ({
  selectedNote,
  isCreating,
  editContent,
  setEditContent,
  onSave,
  onDelete,
  onClose,
  noteIndex,
  isSaving,
}) => {
  if (!selectedNote && !isCreating) return null;

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
    if (isCreating || index === undefined) return "bg-white";
    return backgroundColors[index % backgroundColors.length];
  };

  const handleSave = () => {
    if (!editContent?.trim()) {
      alert("يرجى كتابة محتوى للملاحظة");
      return;
    }
    onSave();
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      handleSave();
    }
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
        onKeyDown={handleKeyDown}
      >
        {/* شريط الأدوات العلوي - التصميم الجديد */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {/* زر الحفظ الجديد */}
            <button
              onClick={handleSave}
              disabled={isSaving || !editContent?.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all hover:shadow-md"
            >
              <span>{isSaving ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
            </button>

            {/* زر الحذف الجديد */}
            {!isCreating && selectedNote && (
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-transparent hover:bg-red-50 text-red-500 hover:text-red-600 border border-red-300 hover:border-red-400 rounded-xl font-medium transition-all hover:shadow-md"
              >
                <span>حذف الملاحظة</span>
              </button>
            )}
          </div>

          {/* زر الإغلاق الجديد */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* منطقة المحتوى */}
        <div
          className="h-full p-6 pb-8 flex flex-col"
          style={{ height: "calc(100% - 80px)" }}
        >
          <div className="flex-1">
            <textarea
              value={editContent || ""}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="ابدأ الكتابة..."
              className="w-full h-full border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-xl leading-relaxed"
              style={{
                fontFamily:
                  "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                direction: "rtl",
              }}
              autoFocus
            />
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200/50">
            <p className="text-xs text-gray-400 text-center">
              اضغط Ctrl+S للحفظ السريع
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditModal;
