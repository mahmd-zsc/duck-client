import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { PiPottedPlantThin } from "react-icons/pi";
import { CiTimer } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { setReviewCount } from "../redux/slices/wordSlice";
import { getReviewCountApi } from "../redux/apiCalls/wordApi";

export default function ReviewWordsOverview() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reviewCount = useSelector((state) => state.word.reviewCount);

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const count = await getReviewCountApi();
        dispatch(setReviewCount(count));
      } catch (err) {
        console.error(err.message);
      }
    };
    if (reviewCount == null) {
      fetchReviewCount();
    }
  }, [dispatch]);

  return (
    <div className="flex flex-1 h-full" dir="rtl">
      <div className="flex-1 flex flex-col w-full bg-white rounded-3xl shadow-sm p-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">جاهز للمراجعة</h1>
        </div>

        <div className="flex flex-1 items-end justify-between">
          <div className="text-center mb-16">
            <div className="mb-3">
              <span className="text-6xl font-light text-gray-900">
                {reviewCount}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <div>من الكلمات والعبارات</div>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-between gap-1">
            <button
              onClick={() =>
                navigate(`/questions?groupSize=10&groupNumber=1&mode=review`)
              }
              className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span>مراجعة</span>
              <span>
                <PiPottedPlantThin size={20} color="green" />
              </span>
            </button>

            <button
              onClick={() =>
                navigate(
                  `/questions?groupSize=10&groupNumber=1&mode=quick-review`
                )
              }
              className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span>مراجعة سريعة</span>
              <span>
                <CiTimer size={20} color="red" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
