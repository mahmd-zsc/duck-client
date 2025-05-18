import React, { useEffect, useState } from "react";
import LessonCard from "./lessonCard";
import LessonModal from "./LessonModal";
import img from "../../../images/download__3_-removebg-preview.png";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLessons } from "../../redux/slices/lessonSlice";

function LessonsCards() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const dispatch = useDispatch();

  const { lessons, loading, error } = useSelector((state) => state.lesson);

  useEffect(() => {
    dispatch(getLessons());
  }, [dispatch]);

  const handleCardClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleCloseModal = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="px-4 sm:px-8">
      {/* Header دايمًا ظاهر */}
      <div className="  mt-20 flex justify-between items-center flex-row-reverse">
        <div className="relative flex gap-1 items-center flex-row-reverse">
          <img className="h-60" src={img} alt="صورة مكعب روبيك" />
          <h1 className="text-5xl  font-semibold">الدروس</h1>
          <div className=" absolute w-full h-full"></div>
        </div>

        <Link to="/add-lesson">
          <button className=" px-8 py-2 bg-[#FDEACA] rounded-full border hover:scale-105 duration-300 cursor-pointer flex items-center justify-center shadow-lg ">
            <MdOutlineAddCircleOutline color="#FC8716" size={30} />
          </button>
        </Link>
      </div>

      {/* الحالات اللي تحت الـ Header */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-white text-xl">
          ⏳ جاري تحميل الدروس...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500 text-xl">
          ❌ حصل خطأ: {error}
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div
            
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 py-10"
          >
            {lessons.map((lesson, index) => (
              <div
                key={index}
                className="w-full max-w-[350px] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105"
              >
                <LessonCard
                  {...lesson}
                  onClick={() => handleCardClick(lesson)}
                />
              </div>
            ))}
          </div>

          {/* Modal */}
          {selectedLesson && (
            <LessonModal lesson={selectedLesson} onClose={handleCloseModal} />
          )}
        </>
      )}
    </div>
  );
}

export default LessonsCards;
