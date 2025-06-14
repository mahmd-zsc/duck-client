import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import axiosInstance from "../../utils/axiosInstance";

const victorySound = new Audio("/sounds/victory.mp3");
victorySound.volume = 0.2;

export default function QuizComplete({ quizzesList, hardCandidates, mode }) {
  const navigate = useNavigate();

  function handlerClick() {
    navigate("/");

    const wordIds = quizzesList.map((q) => q._id).filter(Boolean);
    const hardWordIds = [...new Set(hardCandidates?.filter(Boolean))];

    if (wordIds.length === 0) return;

    const sendReviewUpdates = async () => {
      try {
        const reviewedRes = await axiosInstance.patch(
          "/words/batch/mark-reviewed",
          { wordIds }
        );

        const statsRes = await axiosInstance.patch(
          "/words/batch/review-stats",
          { wordIds }
        );

        console.log("✅ Reviewed:", reviewedRes.data.message);
        console.log("✅ Stats:", statsRes.data.message);

        // لو المود hard-review، ابعت الكلمات السهلة
        if (mode === "hard-review") {
          const easyWordIds = wordIds.filter((id) => !hardWordIds.includes(id));

          if (easyWordIds.length > 0) {
            const easyRes = await axiosInstance.patch(
              "/words/batch/mark-easy",
              { wordIds: easyWordIds }
            );
            console.log("✅ كلمات سهلة:", easyRes.data.message);
          }
        }

        if (hardWordIds.length > 0) {
          const hardRes = await axiosInstance.patch("/words/batch/mark-hard", {
            wordIds: hardWordIds,
          });
          console.log("✅ كلمات صعبة:", hardRes.data.message);
        }
      } catch (error) {
        console.error(
          "❌ خطأ:",
          error.response?.data?.message || error.message
        );
      }
    };

    sendReviewUpdates();
  }

  const runConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#93c5fd", "#86efac", "#fde68a"],
    });
  };

  useEffect(() => {
    victorySound.play();
    const timer = setTimeout(runConfetti, 500); // تأخير بسيط

    return () => {
      clearTimeout(timer);
      victorySound.pause();
      victorySound.currentTime = 0;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-6 flex-1 h-full  p-4 bg-white">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          <span className="text-blue-400">إنجاز رائع!</span>
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          لقد أكملت جميع الأسئلة بنجاح 🌟
        </p>

        <button
          onClick={() => handlerClick()}
          className="px-8 py-3 bg-blue-100 text-blue-600 rounded-lg 
                    hover:bg-blue-200 transition-all duration-200
                    text-lg font-medium shadow-sm"
        >
          العودة للصفحة الرئيسية
        </button>
      </div>
    </div>
  );
}
