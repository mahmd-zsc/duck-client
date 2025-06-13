import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { PiPottedPlantThin } from "react-icons/pi";
import { CiTimer } from "react-icons/ci";

export default function ReviewWordsOverview() {
  const [reviewCount, setReviewCount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviewCount = async () => {
      try {
        const res = await axiosInstance.get("/words/needs-review");
        setReviewCount(res.data.count);
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewCount();
  }, []);

  const handleReviewClick = () => {
    navigate("/quiz/review"); // 👈 غيّر المسار حسب اسم صفحة المراجعة الكاملة
  };

  const handleQuickReviewClick = () => {
    navigate("/quiz/quick-review"); // 👈 غيّر حسب مسار المراجعة السريعة
  };

  // if (loading) return <p className="text-gray-500">جاري التحميل...</p>;
  //if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-1 h-full" dir="rtl">
      <div className=" flex-1 flex flex-col w-full  bg-white rounded-3xl shadow-sm p-8 py-10">
        {/* Header with info icon and title */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">جاهز للمراجعة</h1>
        </div>
        <div className=" flex flex-1 items-end justify-between">
          {/* Main counter section */}
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

          {/* Buttons */}
          <div className=" flex flex-1 items-center justify-between gap-1">
            <button
              onClick={() => {
                navigate(`/questions?groupSize=10&groupNumber=1&mode=review`);
              }}
              className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span>مراجعة</span>
              <span>
                <PiPottedPlantThin size={20} color="green" />
              </span>
            </button>
            <button
              onClick={() => {
                navigate(
                  `/questions?groupSize=10&groupNumber=1&mode=quick-review`
                );
              }}
              className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3"
            >
              <span> مراجعة سريعة</span>
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
