import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Trash2, Plus, Edit3 } from "lucide-react";
import {
  fetchNotes,
  removeNote,
  updateNote,
  addNote,
} from "../redux/slices/noteSlice";
import { generateShapes, renderShape } from "../utils/backgroundShapes";
import NoteEditModal from "../components/NoteEditModal";
import { createNoteApi, updateNoteApi } from "../redux/apiCalls/noteApi";

const Notes = () => {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.note.notes);
  const loading = useSelector((state) => state.note.loading);

  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ألوان الخلفيات الفاتحة
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

  useEffect(() => {
    document.title = "Lexi - قائمة الملاحظات";
    if (notes.length < 1 && !loading) {
      dispatch(fetchNotes());
    }
  }, [dispatch, notes.length, loading]);

  const shapes = useMemo(() => {
    return generateShapes(10);
  }, []);

  const handleNoteClick = (note, index) => {
    setSelectedNote(note);
    setSelectedNoteIndex(index);
    setEditContent(note.content || "");
    setIsCreating(false);
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setSelectedNoteIndex(null);
    setEditContent("");
    setIsCreating(true);
  };

  const handleSaveNote = async () => {
    if (!editContent?.trim()) {
      alert("يرجى كتابة محتوى للملاحظة");
      return;
    }

    setIsSaving(true);

    try {
      if (isCreating) {
        const newNote = {
          content: editContent.trim(),
        };

        // إرسال إلى الباك إند باستخدام createNoteApi
        const createdNote = await createNoteApi(newNote);

        // إضافة الملاحظة المُنشأة إلى Redux store
        dispatch(addNote(createdNote));

        console.log("تم إنشاء الملاحظة بنجاح:", createdNote);
      } else if (selectedNote) {
        const updatedNote = {
          content: editContent.trim(),
        };

        // تحديث في الباك إند باستخدام updateNoteApi
        const updatedNoteFromBackend = await updateNoteApi(
          selectedNote._id,
          updatedNote
        );

        // تحديث في Redux store
        dispatch(updateNote(updatedNoteFromBackend));

        console.log("تم تحديث الملاحظة بنجاح:", updatedNoteFromBackend);
      }

      handleCloseModal();
    } catch (error) {
      console.error("خطأ في حفظ الملاحظة:", error);
      alert("حدث خطأ أثناء حفظ الملاحظة. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId, e) => {
    e.stopPropagation();

    if (!confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
      return;
    }

    try {
      dispatch(removeNote(noteId));
    } catch (error) {
      console.error("خطأ في حذف الملاحظة:", error);
      alert("حدث خطأ أثناء حذف الملاحظة");
    }
  };

  const handleDeleteCurrentNote = async () => {
    if (!selectedNote) return;

    if (!confirm("هل أنت متأكد من حذف هذه الملاحظة؟")) {
      return;
    }

    try {
      dispatch(removeNote(selectedNote._id));
      handleCloseModal();
    } catch (error) {
      console.error("خطأ في حذف الملاحظة:", error);
      alert("حدث خطأ أثناء حذف الملاحظة");
    }
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    setSelectedNoteIndex(null);
    setEditContent("");
    setIsCreating(false);
  };

  const getBackgroundColor = (index) => {
    return backgroundColors[index % backgroundColors.length];
  };

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note, index) => (
        <div
          key={note._id}
          onClick={() => handleNoteClick(note, index)}
          className={`group border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-105 ${getBackgroundColor(
            index
          )}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="text-base text-gray-800 line-clamp-3 mb-2">
                {note.content || "ملاحظة فارغة"}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200/50">
            <p className="text-xs text-gray-400">
              {note.createdAt &&
                new Date(note.createdAt).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">جاري تحميل الملاحظات...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative flex flex-1 h-full p-4" dir="rtl">
        <div className="flex-1 flex flex-col w-full p-8 py-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {shapes.map(renderShape)}
          </div>

          {/* العنوان وأزرار التحكم */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-800">الملاحظات</h1>
              <button
                onClick={handleCreateNote}
                className="flex items-center gap-2 px-6 py-3 bg-[#ffbb00] hover:#ffba00 rounded-xl text-white font-medium transition-all hover:shadow-lg"
              >
                <Plus size={20} />
                ملاحظة جديدة
              </button>
            </div>
            <p className="text-gray-600">
              {notes.length > 0 ? `${notes.length} ملاحظة` : "لا توجد ملاحظات"}
            </p>
          </div>

          <div className="flex flex-1 flex-col relative z-10">
            <div className="flex-1 mb-8">
              {notes.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen size={64} className="mx-auto text-gray-300 mb-6" />
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">
                    لا توجد ملاحظات بعد
                  </h3>
                  <p className="text-gray-400 text-base mb-6 max-w-md mx-auto">
                    ابدأ بإنشاء ملاحظتك الأولى لحفظ أفكارك ومعلوماتك المهمة
                  </p>
                  <button
                    onClick={handleCreateNote}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition-all"
                  >
                    إنشاء ملاحظة جديدة
                  </button>
                </div>
              ) : (
                <GridView />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* مودال تحرير الملاحظة */}
      <NoteEditModal
        selectedNote={selectedNote}
        isCreating={isCreating}
        editContent={editContent}
        setEditContent={setEditContent}
        onSave={handleSaveNote}
        onDelete={handleDeleteCurrentNote}
        onClose={handleCloseModal}
        noteIndex={selectedNoteIndex}
        isSaving={isSaving}
      />
    </>
  );
};

export default Notes;
