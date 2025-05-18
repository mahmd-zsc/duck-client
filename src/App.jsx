import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Words from "./pages/Words";
import Solution from "./pages/Solution";
import Header from "./components/Header/Header";
import AddLesson from "./pages/AddLesson";
import LessonDetail from "./pages/LessonDetail";
import Sidebar from "./components/sidebar/sidebar";
import Questions from "./pages/Questions";

/* ❶ ـــ استيراد الكمبوننت الجديد */
import FloatingNote from "./components/FloatingNote/FloatingNote";

function App() {
  const location = useLocation();
  const isQuestionPage = location.pathname.startsWith("/questions");

  return (
    <>
      {/* ❷ ـــ عنصر الفلكسينج الرئيسي */}
      <div className="flex">
        <div className="relative w-full">
          {!isQuestionPage && <Header />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/words" element={<Words />} />
            <Route path="/solution" element={<Solution />} />
            <Route path="/add-lesson" element={<AddLesson />} />
            <Route path="/lesson/:id" element={<LessonDetail />} />
            <Route path="/questions/" element={<Questions />} />
          </Routes>
        </div>
        {!isQuestionPage && <Sidebar />}
      </div>

      {/* ❸ ـــ الفلوتينج نوت دايمًا متاحة فوق الكل */}
      {/* <FloatingNote /> */}

      {/* ❹ ـــ (اختياري) الفوتر لو عندك */}
      {/* <Footer /> */}
    </>
  );
}

export default App;
