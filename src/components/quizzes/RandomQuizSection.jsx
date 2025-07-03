import React, { useState } from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { Info } from "lucide-react";
import { PiPottedPlantThin } from "react-icons/pi";
import { CiTimer } from "react-icons/ci";

const RandomQuizSection = ({
  totalQuizzesCount,
  rules = [],
  onStartRandomQuiz,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedRule, setSelectedRule] = useState(null);
  const [difficulty, setDifficulty] = useState("all");

  const handleStartQuiz = () => {
    onStartRandomQuiz({
      count: questionCount,
      rule: selectedRule,
      difficulty: difficulty,
    });
    setIsModalVisible(false);
  };

  // Handle escape key
  const handleEscape = (e) => {
    if (e.key === "Escape") setIsModalVisible(false);
  };

  React.useEffect(() => {
    if (isModalVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isModalVisible]);

  const handleNormalQuiz = () => {
    onStartRandomQuiz({
      count: 10,
      rule: null,
      difficulty: "all",
      mode: "normal",
    });
  };

  const handleQuickQuiz = () => {
    onStartRandomQuiz({
      count: 10,
      rule: null,
      difficulty: "all",
      mode: "quick",
    });
  };

  return (
    <>
      <div className="flex flex-1 h-full" dir="rtl">
        <div className="flex-1 flex flex-col w-full bg-white rounded-3xl shadow-sm p-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
              <Info size={12} className="text-gray-500" />
            </div>
            <h1 className="text-base font-normal text-gray-800">جاهز للحل</h1>
          </div>

          <div className="flex flex-1 items-end justify-between">
            <div className="text-center mb-16">
              <div className="mb-3">
                <span className="text-6xl font-light text-gray-900">
                  {totalQuizzesCount ?? "0"}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <div>من الأسئلة والتمارين</div>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-between gap-1">
              <button
                onClick={handleNormalQuiz}
                disabled={totalQuizzesCount === 0}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>حل أسئلة</span>
                <span>
                  <PiPottedPlantThin size={20} color="green" />
                </span>
              </button>

              <button
                onClick={() => setIsModalVisible(true)}
                disabled={totalQuizzesCount === 0}
                className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>إعدادات متقدمة</span>
                <span>
                  <CiTimer size={20} color="red" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* المودال للإعدادات */}
      {isModalVisible && (
        <div
          onClick={(e) => {
            if (e.target.classList.contains("overlay")) {
              setIsModalVisible(false);
            }
          }}
          className="overlay fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          style={{ background: "rgba(0,0,0,0.4)" }}
          dir="rtl"
        >
          <div className="w-[95%] sm:w-[500px] lg:w-[650px] max-h-[95vh] overflow-y-auto bg-white rounded-3xl shadow-sm relative">
            {/* Modal content */}
            <div className="relative z-10 p-8 py-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
                  <Info size={12} className="text-gray-500" />
                </div>
                <h1 className="text-base font-normal text-gray-800">
                  إعدادات الأسئلة
                </h1>
              </div>

              {/* Settings Section */}
              <div className="space-y-6 mb-8">
                {/* عدد الأسئلة */}
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3">
                    عدد الأسئلة:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={Math.min(totalQuizzesCount, 50)}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(+e.target.value)}
                    className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    placeholder="اختر عدد الأسئلة"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    الحد الأقصى: {Math.min(totalQuizzesCount, 50)} سؤال
                  </div>
                </div>

                {/* تصفية حسب القاعدة */}
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-3">
                    القاعدة (اختياري):
                  </label>
                  <select
                    value={selectedRule || ""}
                    onChange={(e) => setSelectedRule(e.target.value || null)}
                    className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
                  >
                    <option value="">كل القواعد</option>
                    {rules.map((rule) => (
                      <option key={rule.rule} value={rule.rule}>
                        {rule.rule} ({rule.count} سؤال)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main counter section */}
              <div className="text-center mb-8">
                <div className="mb-3">
                  <span className="text-6xl font-light text-gray-900">
                    {totalQuizzesCount}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  <div>إجمالي الأسئلة المتاحة</div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="w-full">
                <button
                  onClick={handleStartQuiz}
                  disabled={totalQuizzesCount === 0}
                  className="w-full bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>ابدأ الكويز</span>
                  <span>
                    <PlayCircleOutlined style={{ color: "green" }} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RandomQuizSection;
