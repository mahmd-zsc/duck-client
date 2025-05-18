import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteLesson } from "../../redux/slices/lessonSlice";

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
      className="px-6 py-3 bg-red-400 text-black border rounded-full font-semibold text-lg  transition-all duration-300 hover:scale-105 cursor-pointer shadow-md"
    >
      Delete Lesson
    </button>
  );
};

export default DeleteLessonButton;
