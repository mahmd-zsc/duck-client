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
          className={`group border rounded-2xl p-4 transition-all duration-200 cursor-pointer hover:shadow-sm ${getBackgroundColor(
            index
          )}`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <p className="text-sm text-gray-700 line-clamp-3 mb-2">
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
      <div className="flex flex-1" dir="rtl">
        <div className="flex-1 flex flex-col w-full p-10">
          {/* Header with icon and title */}
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
              <BookOpen size={12} className="text-gray-500" />
            </div>
            <h1 className="text-base font-normal text-gray-800">الملاحظات</h1>
          </div>

          {/* Status Messages */}
          {loading && (
            <div className="mb-4 text-center text-blue-500 text-sm">
              جاري تحميل الملاحظات...
            </div>
          )}

          <div className="flex flex-1 flex-col justify-between">
            {/* Notes Section */}
            <div className="flex-1">
              {notes.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-normal text-gray-500 mb-2">
                    لا توجد ملاحظات بعد
                  </h3>
                  <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                    ابدأ بإنشاء ملاحظتك الأولى لحفظ أفكارك ومعلوماتك المهمة
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    {notes.length} ملاحظة
                  </p>
                  <GridView />
                </div>
              )}
            </div>

            {/* Add Note Button */}
            <div className="mt-8">
              <button
                onClick={handleCreateNote}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                إضافة ملاحظة جديدة
              </button>
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
