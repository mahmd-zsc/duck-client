import React, { useState, useEffect } from "react";
import { StickyNote, Plus, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { addNote } from "../../redux/slices/noteSlice";
import { createNoteApi } from "../../redux/apiCalls/noteApi";

const FloatingNote = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleNote = () => setIsOpen(!isOpen);

  const handleAddNote = async () => {
    if (noteText.trim() === "") return;

    setIsSaving(true);

    try {
      const newNote = {
        content: noteText.trim(),
      };

      const createdNote = await createNoteApi(newNote);
      dispatch(addNote(createdNote));

      console.log("تم إنشاء الملاحظة بنجاح:", createdNote);
      setNoteText("");
      setIsOpen(false);
    } catch (error) {
      console.error("خطأ في حفظ الملاحظة:", error);
      alert("حدث خطأ أثناء حفظ الملاحظة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAddNote();
    }
  };

  return (
    <>
      {/* الزر العائم */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={toggleNote}
          className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-500 text-white shadow-lg flex items-center justify-center transition-all hover:shadow-xl hover:scale-105"
        >
          {isOpen ? <X size={24} /> : <StickyNote size={24} />}
        </button>
      </div>

      {/* النافذة المنبثقة */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={toggleNote}
        >
          <div
            className="bg-white w-full max-w-2xl h-[70vh] rounded-2xl shadow-2xl overflow-hidden relative border border-gray-200 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Header with icon and title */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
              <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                <StickyNote size={12} className="text-gray-500" />
              </div>
              <h2 className="text-base font-normal text-gray-800">
                ملاحظة سريعة
              </h2>
              <button
                onClick={toggleNote}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* منطقة الكتابة */}
            <div className="flex-1 p-6">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب ملاحظتك هنا... (Ctrl+Enter للحفظ)"
                className="w-full h-full border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none resize-none text-sm leading-relaxed"
                style={{
                  fontFamily: "'Tajawal', 'Cairo', sans-serif",
                  direction: "rtl",
                  minHeight: "400px",
                }}
                autoFocus
              />
            </div>

            {/* أزرار الحفظ والإلغاء */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={toggleNote}
                disabled={isSaving}
                className="px-6 py-3 bg-white border border-gray-300 rounded-2xl text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={handleAddNote}
                disabled={!noteText.trim() || isSaving}
                className="flex-1 py-3 bg-white border border-gray-300 rounded-2xl text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <span>جاري الحفظ...</span>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>حفظ الملاحظة</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* إضافة الأنيميشن */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default FloatingNote;
