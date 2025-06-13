import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { Zap, Info } from "lucide-react";

export default function HardWordsCount() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHardWordsCount = async () => {
      try {
        const res = await axiosInstance.get("/words/hard/count");
        setCount(res.data.count);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchHardWordsCount();
  }, []);

  const handlePracticeClick = () => {
    navigate("/quiz/hard-words");
  };

  if (loading)
    return (
      <div className="p-6 bg-white rounded-lg text-right">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );

  if (error)
    return (
      <div className="p-6  rounded-lg text-right text-red-500">{error}</div>
    );

  return (
    <div className="  flex items-center   " dir="rtl">
      <div className="w-full  bg-white rounded-3xl shadow-sm p-8  ">
        {/* Header with info icon and title */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">كلمات صعبة</h1>
        </div>
        <div className=" flex justify-between items-end">
          {/* Main counter section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-6 mb-3">
              {/* Lightning bolt icon */}
              <Zap size={24} className="text-yellow-400 fill-yellow-400" />
              <span className="text-6xl font-light text-gray-900">{count}</span>
            </div>
            <div className="text-sm text-gray-500 space-y-0.5">
              <div>من الكلمات</div>
              <div>والعبارات</div>
            </div>
          </div>

          {/* Training button */}
          <div className="flex justify-start">
            <button
              onClick={() => {
                navigate(
                  `/questions?groupSize=10&groupNumber=1&mode=hard-review`
                );
              }}
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
