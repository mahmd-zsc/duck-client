import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ModalAddWord from "../components/lessonDetail/ModalAddWord";
import { getLessonById } from "../redux/slices/lessonSlice";
import DeleteLessonButton from "../components/lessonDetail/DeleteLessonButton";
import funduck from "../../images/Funny_Cool_Goose_Men_s_Perfect_Tee_By_katzura_-_Design_By_Humans-removebg-preview.png";
function LessonDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const { selectedLesson, loading, error } = useSelector(
    (state) => state.lesson
  );
  useEffect(() => {
    dispatch(getLessonById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedLesson) {
      setProgressPercent(selectedLesson.reviewedPercentage);
    }
  }, [selectedLesson]);

  const getLevelInfo = (level) => {
    switch (level) {
      case "beginner":
        return { label: "مبتدئ", color: "#4CAF50" };
      case "intermediate":
        return { label: "متوسط", color: "#FFC107" };
      case "advanced":
        return { label: "متقدم", color: "#F44336" };
      default:
        return { label: level, color: "#9E9E9E" };
    }
  };

  if (loading || !selectedLesson) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }
  const levelInfo = getLevelInfo(selectedLesson.level);

  return (
    <>
      <div className="overflow-hidden relative">
        {/* صورة الكوفر لو عايز ترجعها بعدين */}
      </div>

      <div
        className="min-h-screen bg-gray-50 px-10 pt-20 pb-8 flex flex-col  justify-between relative overflow-hidden   "
        style={{
          backgroundImage:
            "linear-gradient(to left bottom, #fffcf3, #fffaeb, #fff8e4, #fff6dc, #fff4d5)",
        }}
        dir="rtl"
      >
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-right  text-gray-800 relative order-1 ">
            <span className="text-2xl font-bold bg-[#FFBB00] w-fit px-2 py-1 rounded-full border">
              {selectedLesson.wordsNumber}
            </span>{" "}
            - {selectedLesson.title}
          </h2>
          <div
            className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden"
            dir="rtl"
          >
            <div
              className="h-full rounded-full bg-[#FFBB00] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <p
            className="text-lg font-semibold mb-6 w-fit px-4 py-2 rounded-full border border-black"
            style={{ backgroundColor: levelInfo.color, color: "#fff" }}
          >
            {levelInfo.label}
          </p>
          <div className="mb-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-8">
              الكلمات
            </h3>
            <ul className="pl-6 grid grid-cols-4 gap-5 my-10 relative z-10">
              {selectedLesson.words.map((wordObj, index) => (
                <li
                  key={index}
                  className="text-lg text-gray-700 flex items-center gap-2 duration-200 hover:scale-105"
                >
                  <span className=" text-xs">🦆</span>
                  <span>{wordObj.word}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between mt-6 gap-4 flex-wrap"></div>
        </div>{" "}
        <div className=" flex items-center justify-end gap-10">
          <DeleteLessonButton lessonId={selectedLesson._id} />{" "}
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-[#FC8716] text-white border border-black rounded-full font-semibold text-lg shadow-md transition duration-300 hover:scale-105 cursor-pointer"
          >
            Add New Word
          </button>
        </div>
        <ModalAddWord
          showModal={showModal}
          lessonId={selectedLesson._id}
          setShowModal={setShowModal}
        />
        <div className=" absolute -right-10 -bottom-20 opacity-40 ">
          <img className=" h-80" src={funduck} alt="" />
        </div>
      </div>
    </>
  );
}

export default LessonDetail;
