import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router-dom";

function LessonModal({ lesson, onClose }) {
  const [groupSize, setGroupSize] = useState(5);
  const [selectedGroup, setSelectedGroup] = useState(1);

  const totalGroups = Math.ceil(lesson.wordsNumber / groupSize);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      onClose();
    }
  };

  const handleGoToLessonPage = () => {
    navigate(`/lesson/${lesson._id}`);
  };

  const handleGenerateQuizzes = async () => {

    navigate(
      `/questions?lessonId=${lesson._id}&groupSize=${groupSize}&groupNumber=${selectedGroup}`
    );
  };

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="overlay fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
    >
      <div
        className="p-8 w-[90%] max-w-xl animate-popIn border"
        style={{
          borderRadius: "34px",
          background: "#fff",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* معلومات الدرس */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-gray-900">
            {lesson.emoji} {lesson.title}
          </h2>
          <p className="text-sm capitalize text-gray-500 mb-2">
            المستوى: {lesson.level}
          </p>
          <p className="text-md font-medium text-gray-700">
            عدد الكلمات: {lesson.wordsNumber}
          </p>
        </div>

        {/* اختيار حجم المجموعة */}
        <div className="mb-4">
          <label className="font-semibold block mb-2 text-gray-600">
            عدد الكلمات في كل مجموعة:
          </label>
          <select
            className="border border-black bg-[#FDEACA] text-[#FC8716] rounded-full px-4 py-2 w-full transition duration-300  cursor-pointer"
            value={groupSize}
            onChange={(e) => {
              setGroupSize(Number(e.target.value));
              setSelectedGroup(1);
            }}
          >
            {[5, 10, 15].map((size) => (
              <option key={size} value={size}>
                {size} كلمة
              </option>
            ))}
          </select>
        </div>

        {/* اختيار المجموعة */}
        <div className="mb-6">
          <label className="font-semibold block mb-2 text-gray-600">
            اختر مجموعة:
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalGroups }, (_, i) => (
              <button
                key={i}
                onClick={() => setSelectedGroup(i + 1)}
                className={`px-6 py-3 rounded-full border text-sm font-medium transition-all duration-300 ${
                  selectedGroup === i + 1
                    ? "bg-[#FC8716] text-white border-black scale-105"
                    : "bg-[#FDEACA] text-[#FC8716] border-black"
                } hover:scale-105`}
              >
                المجموعة {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* زر الذهاب لصفحة الدرس */}
        <button
          onClick={handleGoToLessonPage}
          className="w-full py-4 rounded-full border border-black hover:scale-105 duration-300 bg-[#FDEACA] text-[#FC8716] cursor-pointer mb-2"
        >
          الذهاب لتفاصيل الدرس
        </button>

        {/* زر البدء في الحل */}
        <button
          onClick={handleGenerateQuizzes}
          className="w-full py-4 rounded-full border border-black hover:scale-105 duration-300 bg-[#FDEACA] text-[#FC8716] cursor-pointer"
        >
          البدء في الحل
        </button>
      </div>
    </div>,
    document.body
  );
}

export default LessonModal;
