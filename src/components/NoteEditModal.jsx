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
    if (isCreating || index === undefined) return "bg-white border-gray-300";
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
        className={`w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden relative border ${getBackgroundColor(
          noteIndex
        )}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* شريط الأدوات العلوي - مع الأزرار */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-normal text-gray-800">
              {isCreating ? "إنشاء ملاحظة جديدة" : "تحرير الملاحظة"}
            </h2>
          </div>

          {/* أزرار صغيرة في الهيدر */}
          <div className="flex items-center gap-2">
            {/* زر الحفظ */}
            <button
              onClick={handleSave}
              disabled={isSaving || !editContent?.trim()}
              className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="حفظ (Ctrl+S)"
            >
              <Save size={14} className="text-gray-600" />
            </button>

            {/* زر الحذف */}
            {!isCreating && selectedNote && (
              <button
                onClick={onDelete}
                className="w-8 h-8 rounded-full border border-red-300 flex items-center justify-center hover:bg-red-50 transition-colors"
                title="حذف الملاحظة"
              >
                <Trash2 size={14} className="text-red-500" />
              </button>
            )}

            {/* زر الإغلاق */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-100 transition-colors"
              title="إغلاق"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* منطقة المحتوى - تركيز كامل على النص */}
        <div className="h-full p-6" style={{ height: "calc(100% - 80px)" }}>
          {/* Status Messages */}
          {isSaving && (
            <div className="mb-4 text-center text-blue-500 text-sm">
              جاري الحفظ...
            </div>
          )}

          {/* منطقة النص - تأخذ كامل المساحة */}
          <textarea
            value={editContent || ""}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="ابدأ الكتابة..."
            className="w-full h-full p-4 border-0 bg-transparent text-gray-700 text-sm leading-relaxed focus:outline-none resize-none"
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
