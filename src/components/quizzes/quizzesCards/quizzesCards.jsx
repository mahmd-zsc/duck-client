import React, { useEffect, useState } from "react";
import QuizCard from "../QuizCard";
import QuizModal from "../QuizModal";
import ModalAddQuiz from "../ModalAddQuiz";
import img from "../../../../images/deepstash-grow-with-app-768x576-removebg-preview.png";

import { MdOutlineAddCircleOutline } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizRules } from "../../../redux/slices/quizSlice";

function QuizzesCards() {
  const [selectedQuizRule, setSelectedQuizRule] = useState(null);
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState("");
  const dispatch = useDispatch();
  const { quizRules, loading, error } = useSelector((state) => state.quiz);

  useEffect(() => {
    if (quizRules.length === 0) {
      dispatch(fetchQuizRules());
    }
  }, [dispatch]);

  return (
    <div className="px-3 sm:px-6 md:px-8 lg:px-12 xl:px-20">
      <header className="mt-6 flex flex-col md:flex-row-reverse items-center md:justify-between gap-6">
        <div className="relative flex flex-row-reverse items-center gap-2">
          <img
            src={img}
            alt="صورة أيقونة أسئلة"
            className="h-36 sm:h-44 md:h-52 lg:h-60 2xl:h-72 select-none"
          />
          <h1 className="font-light leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl">
            أسئلة الترجمة
          </h1>
          <div className="absolute left-0 top-0 w-full h-full"></div>
        </div>

        <Link to="/add-quiz" aria-label="إضافة سؤال">
          <button className="flex items-center justify-center rounded-3xl border border-gray-300 bg-white shadow-sm transition-transform duration-300 hover:scale-105 px-6 sm:px-7 md:px-8 py-3">
            <CiCirclePlus className="text-gray-600" size={24} />
          </button>
        </Link>
      </header>

      {false ? (
        <div className="flex justify-center items-center h-40 text-xl animate-pulse">
          ⏳ جاري تحميل الأسئلة...
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-40 text-red-500 text-xl">
          ❌ حصل خطأ: {error}
        </div>
      ) : (
        <>
          <section className="py-10 grid gap-5 sm:gap-6 md:gap-8 lg:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-3">
            {quizRules.map((rule) => (
              <article
                key={rule.rule}
                className="w-full max-w-[360px] mx-auto bg-white shadow-lg rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <QuizCard
                  title={rule.rule}
                  rule={rule.rule}
                  questionsCount={rule.count}
                  onClick={() => setSelectedQuizRule(rule)}
                />
              </article>
            ))}
          </section>

          {selectedQuizRule && (
            <QuizModal
              quizRule={selectedQuizRule}
              onClose={() => setSelectedQuizRule(null)}
              setShowAddQuizModal={setShowAddQuizModal}
              setSelectedRule={setSelectedRule}
            />
          )}

          {showAddQuizModal && (
            <ModalAddQuiz
              showModal={showAddQuizModal}
              setShowModal={setShowAddQuizModal}
              rule={selectedRule}
            />
          )}
        </>
      )}
    </div>
  );
}

export default QuizzesCards;
