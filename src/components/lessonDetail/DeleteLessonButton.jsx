import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteLesson } from "../../redux/slices/lessonSlice";
import { Trash2 } from "lucide-react";

const DeleteLessonButton = ({ lessonId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm("هل أنت متأكد من حذف الدرس؟ 😢");
    if (confirm) {
      try {
        await dispatch(deleteLesson(lessonId)).unwrap();
        navigate("/lessons"); // بعد الحذف يوديه للصفحة الرئيسية
      } catch (err) {
        alert("حصل خطأ أثناء الحذف 😓");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex-1 bg-white border border-red-300 rounded-2xl py-4 text-red-600 text-sm font-normal hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-2"
    >
      <Trash2 size={16} />
      حذف الدرس
    </button>
  );
};

export default DeleteLessonButton;
