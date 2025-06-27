import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setNeedsReviewCount,
  setHardQuizzesCount,
} from "../redux/slices/quizSlice";
import {
  getNeedsReviewCountApi,
  getHardQuizzesCountApi,
} from "../redux/apiCalls/quizApi";

export default function QuizStatsOverview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { needsReviewCount, hardQuizzesCount } = useSelector(
    (state) => state.quiz
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [reviewCount, hardCount] = await Promise.all([
          getNeedsReviewCountApi(),
          getHardQuizzesCountApi(),
        ]);
        dispatch(setNeedsReviewCount(reviewCount));
        dispatch(setHardQuizzesCount(hardCount));
      } catch (error) {
        console.error("فشل تحميل إحصائيات الأسئلة:", error.message);
      }
    };

    fetchStats();
  }, [dispatch]);

  return (
    <div
      className="flex-1 flex flex-col w-full bg-white rounded-3xl shadow-sm p-8 py-10"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
          <Info size={12} className="text-gray-500" />
        </div>
        <h1 className="text-base font-normal text-gray-800">
          إحصائيات الأسئلة
        </h1>
      </div>

      <div className="flex flex-1 items-end justify-between gap-6">
        {/* تحتاج مراجعة */}
        <div className="text-center flex-1">
          <div className="mb-3">
            <span className="text-4xl font-light text-gray-900">
              {needsReviewCount ?? "0"}
            </span>
          </div>
          <div className="text-sm text-gray-500">سؤال يحتاج مراجعة</div>
          <button
            onClick={() => navigate(`/quizzes/review`)}
            className="mt-4 w-full bg-white border border-gray-300 rounded-2xl py-2 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm"
          >
            مراجعة الأسئلة
          </button>
        </div>

        {/* الأسئلة الصعبة */}
        <div className="text-center flex-1">
          <div className="mb-3">
            <span className="text-4xl font-light text-gray-900">
              {hardQuizzesCount ?? "0"}
            </span>
          </div>
          <div className="text-sm text-gray-500">سؤال صعب</div>
          <button
            onClick={() => navigate(`/quizzes/hard`)}
            className="mt-4 w-full bg-white border border-gray-300 rounded-2xl py-2 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm"
          >
            تدرب على الصعبة
          </button>
        </div>

        {/* جميع الأسئلة */}
        <div className="text-center flex-1">
          <div className="mb-3">
            <span className="text-4xl font-light text-gray-900">
              {needsReviewCount + hardQuizzesCount ?? "0"}
            </span>
          </div>
          <div className="text-sm text-gray-500">إجمالي الأسئلة</div>
          <button
            onClick={() => navigate(`/quizzes/all`)}
            className="mt-4 w-full bg-gray-800 text-white rounded-2xl py-2 text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm"
          >
            عرض الكل
          </button>
        </div>
      </div>
    </div>
  );
}
