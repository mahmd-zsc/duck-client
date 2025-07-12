import React, { useEffect, useState } from "react";
import LessonCard from "./lessonCard";
import LessonModal from "./LessonModal";
import img from "../../../images/deepstash-transfer-knowledge2-1024x960-removebg-preview.png";

import { MdOutlineAddCircleOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getLessons } from "../../redux/slices/lessonSlice";

function LessonsCards() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const dispatch = useDispatch();
  const { lessons, loading, error } = useSelector((state) => state.lesson);
  useEffect(() => {
    if (lessons.length < 1) {
      dispatch(getLessons());
    }
  }, [dispatch]);

  return (
    <div className="px-3 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      {/* ---------- Header ---------- */}
      <header className="mt-6 flex flex-col md:flex-row-reverse items-center md:justify-between gap-6">
        <div className="relative flex flex-row-reverse items-center gap-2">
          <img
            src={img}
            alt="صورة مكعب روبيك"
            className="h-36 sm:h-44 md:h-52 lg:h-60 2xl:h-72 select-none"
          />
          <h1 className="font-light leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
            الدروس
          </h1>
        </div>

        <div className="flex gap-3">
          {/* زر إضافة درس */}
          <Link to="/add-lesson" aria-label="إضافة درس">
            <button className="flex items-center justify-center rounded-3xl border border-gray-300 bg-white shadow-sm transition-transform duration-300 hover:scale-105 px-6 sm:px-7 md:px-8 py-3">
              <CiCirclePlus className="text-gray-600" size={24} />
              <span className="mr-2 text-sm">إضافة درس</span>
            </button>
          </Link>

          {/* زر إضافة مجموعة دروس (جديد) */}
          <Link to="/add-lessonGroup" aria-label="إضافة مجموعة دروس">
            <button className="flex items-center justify-center rounded-3xl border border-gray-300 bg-white shadow-sm transition-transform duration-300 hover:scale-105 px-6 sm:px-7 md:px-8 py-3">
              <CiCirclePlus className="text-gray-600" size={24} />
              <span className="mr-2 text-sm">إضافة مجموعة</span>
            </button>
          </Link>
        </div>
      </header>

      {/* ---------- Content States ---------- */}
      {loading ? (
        <div className="flex justify-center items-center h-40 text-xl animate-pulse">
          ⏳ جاري تحميل الدروس...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500 text-xl">
          ❌ حصل خطأ: {error}
        </div>
      ) : (
        <>
          {/* ---------- Cards Grid ---------- */}
          <section className="py-10 grid gap-5 sm:gap-6 md:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3">
            {lessons.map((lesson) => (
              <article
                key={lesson._id}
                className="w-full max-w-[360px] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <LessonCard
                  {...lesson}
                  onClick={() => setSelectedLesson(lesson)}
                />
              </article>
            ))}
          </section>

          {/* ---------- Modal ---------- */}
          {selectedLesson && (
            <LessonModal
              lesson={selectedLesson}
              onClose={() => setSelectedLesson(null)}
              className="max-w-[90vw] sm:max-w-[600px] lg:max-w-[800px]"
            />
          )}
        </>
      )}
    </div>
  );
}

export default LessonsCards;
