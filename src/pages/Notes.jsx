import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookOpen, Trash2, Plus } from "lucide-react";
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

  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
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
    if (notes.length < 1) dispatch(fetchNotes());
  }, [dispatch]);

  const shapes = useMemo(() => {
    return generateShapes(10);
  }, []);



  const handleNoteClick = (note, index) => {
    setSelectedNote(note);
    setSelectedNoteIndex(index);
    setEditTitle(note.title);
    setEditContent(note.content || "");
    setIsCreating(false);
  };

  const handleCreateNote = () => {
    setSelectedNote(null);
    setSelectedNoteIndex(null);
    setEditTitle("");
    setEditContent("");
    setIsCreating(true);
  };

  const handleSaveNote = async () => {
    if (!editTitle?.trim()) return;

    setIsSaving(true);

    try {
      if (isCreating) {
        const newNote = {
          title: editTitle,
          content: editContent,
          createdAt: new Date().toISOString(),
        };
        
        // إرسال إلى الباك إند باستخدام createNoteApi
        const createdNote = await createNoteApi(newNote);
        console.log(createdNote)
        // إضافة الملاحظة المُنشأة إلى Redux store
        dispatch(addNote(createdNote));
        
        console.log('تم إنشاء الملاحظة بنجاح:', createdNote);
      } else if (selectedNote) {
        const updatedNote = {
          title: editTitle,
          content: editContent,
          updatedAt: new Date().toISOString(),
        };
        
        // تحديث في الباك إند باستخدام updateNoteApi
        const updatedNoteFromBackend = await updateNoteApi(selectedNote._id, updatedNote);
        
        // تحديث في Redux store
        dispatch(updateNote(updatedNoteFromBackend));
        
        console.log('تم تحديث الملاحظة بنجاح:', updatedNoteFromBackend);
      }

      handleCloseModal();
    } catch (error) {
      console.error('خطأ في حفظ الملاحظة:', error);
      // يمكنك إضافة toast notification هنا لإظهار الخطأ للمستخدم
      alert('حدث خطأ أثناء حفظ الملاحظة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = (noteId, e) => {
    e.stopPropagation();
    dispatch(removeNote(noteId));
  };

  const handleDeleteCurrentNote = () => {
    if (selectedNote) {
      dispatch(removeNote(selectedNote._id));
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
    setSelectedNoteIndex(null);
    setEditTitle("");
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
          className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${getBackgroundColor(
            index
          )}`}
        >
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
              {note.title}
            </h2>
            <button
              onClick={(e) => handleDeleteNote(note._id, e)}
              className="p-1 rounded hover:bg-white/50 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 line-clamp-4">{note.content}</p>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="space-y-3">
      {notes.map((note, index) => (
        <div
          key={note._id}
          onClick={() => handleNoteClick(note, index)}
          className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${getBackgroundColor(
            index
          )}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                {note.title}
              </h2>
              <p className="text-base text-gray-600 line-clamp-2">
                {note.content}
              </p>
            </div>
            <button
              onClick={(e) => handleDeleteNote(note._id, e)}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors ml-4"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="relative flex flex-1 h-full p-4" dir="rtl">
        <div className="flex-1 flex flex-col w-full p-8 py-10 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {shapes.map(renderShape)}
          </div>

          {/* أزرار التحكم */}
          <div className="mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreateNote}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm transition-all"
              >
                <Plus size={14} />
                ملاحظة جديدة
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col relative z-10">
            <div className="flex-1 mb-8">
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-2">لا توجد ملاحظات</p>
                  <p className="text-gray-400 text-sm">
                    ابدأ بإضافة ملاحظة جديدة
                  </p>
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
        editTitle={editTitle}
        setEditTitle={setEditTitle}
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