import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import QuizzesCards from "../components/quizzes/quizzesCards/quizzesCards";
import RandomQuizSection from "../components/quizzes/RandomQuizSection";

export default function QuizzesHome() {
  const navigate = useNavigate();
  const [quizzesData, setQuizzesData] = useState({
    quizzes: [],
    totalCount: 0,
    rules: [],
    recentStats: {
      totalAnswered: 0,
      correctAnswers: 0,
      streak: 0,
    },
  });

  useEffect(() => {
    document.title = "Lexi - أسئلة الترجمة";

    // يمكنك هنا تحميل البيانات من API
    // fetchQuizzesData();
  }, []);

  // دالة لبدء الكويز العشوائي
  const handleStartRandomQuiz = (quizSettings) => {
    if (quizzesData.totalCount === 0) {
      message.warning("لا توجد أسئلة متاحة للحل!");
      return;
    }

    // يمكنك هنا إرسال الإعدادات إلى صفحة الكويز
    console.log("Quiz Settings:", quizSettings);

    // مثال على التنقل إلى صفحة الكويز
    // navigate('/quiz/random', { state: quizSettings });

    message.success(`تم بدء كويز عشوائي بـ ${quizSettings.count} سؤال!`);
  };

  // بيانات تجريبية - يمكنك استبدالها ببيانات حقيقية من API
  const mockData = {
    totalCount: 150,
    rules: [
      { rule: "الأفعال المساعدة", count: 25 },
      { rule: "الأزمنة", count: 30 },
      { rule: "حروف الجر", count: 20 },
      { rule: "الضمائر", count: 18 },
      { rule: "الصفات", count: 22 },
      { rule: "الأسماء", count: 35 },
    ],
  };

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to left bottom, #fffcf3, #fffaeb, #fff8e4, #fff6dc, #fff4d5)",
        minHeight: "calc(100vh - 82px)",
      }}
      className="pt-8"
    >
      <div className="container px-4 md:px-8 lg:px-20">
        {" "}
        <h2 className="text-2xl font-bold text-gray-800 mb-10">جميع الأسئلة</h2>
        {/* قسم الكويز العشوائي */}
        <RandomQuizSection
          totalQuizzesCount={mockData.totalCount}
          rules={mockData.rules}
          onStartRandomQuiz={handleStartRandomQuiz}
        />
        {/* قسم كروت الأسئلة */}
        <div className="   p-6 md:p-8  ">
          <div className="flex items-center justify-between gap-3 mb-6"></div>
          <QuizzesCards />
        </div>
      </div>
    </div>
  );
}
