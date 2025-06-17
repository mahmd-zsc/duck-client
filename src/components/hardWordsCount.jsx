import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Info } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setHardWordsCount } from "../redux/slices/wordSlice";
import { getHardWordsCountApi } from "../redux/apiCalls/wordApi";

export default function HardWordsCount() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hardWordsCount = useSelector((state) => state.word.hardWordsCount);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await getHardWordsCountApi();
        dispatch(setHardWordsCount(count));
      } catch (error) {
        console.error("فشل تحميل الكلمات الصعبة:", error.message);
      }
    };
    if (hardWordsCount == null) {
      fetchCount();
    }
  }, [dispatch]);

  return (
    <div className="flex items-center" dir="rtl">
      <div className="w-full bg-white rounded-3xl shadow-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">كلمات صعبة</h1>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 mb-3">
              <Zap size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-6xl font-light text-gray-900">
                {hardWordsCount ?? "0"}
              </span>
            </div>
            <div className="text-sm text-gray-500 space-y-0.5">
              <div>من الكلمات</div>
              <div>والعبارات</div>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={() =>
                navigate(
                  `/questions?groupSize=10&groupNumber=1&mode=hard-review`
                )
              }
              className="bg-white border border-gray-300 rounded-full px-8 py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm"
            >
              تدرب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
