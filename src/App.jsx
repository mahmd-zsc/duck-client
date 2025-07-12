import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Words from "./pages/Words";
import Solution from "./pages/Solution";
import Header from "./components/Header/Header";
import AddLesson from "./pages/AddLesson";
import LessonDetail from "./pages/LessonDetail";
import Sidebar from "./components/sidebar/sidebar";
import Questions from "./pages/Questions";
import Notes from "./pages/Notes";
import QuizzesHome from "./pages/QuizzesHome"; // تمت إضافتها
import FloatingNote from "./components/FloatingNote/FloatingNote";
import AddLessonGroup from "./pages/AddLessonGroup";

function App() {
  const location = useLocation();
  const isQuestionPage = location.pathname.startsWith("/questions");

  return (
    <>
      <div className="flex">
        <div className="relative w-full">
          {!isQuestionPage && <Header />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/words" element={<Words />} />
            <Route path="/solution" element={<Solution />} />
            <Route path="/add-lesson" element={<AddLesson />} />
            <Route path="/add-lessonGroup" element={<AddLessonGroup />} />
            <Route path="/lesson/:id" element={<LessonDetail />} />
            <Route path="/questions/" element={<Questions />} />
            <Route path="/quizzes" element={<QuizzesHome />} />{" "}
            {/* تمت إضافتها */}
            <Route
              path="/quizzes/review"
              element={<Questions mode="review" />}
            />
            <Route path="/quizzes/hard" element={<Questions mode="hard" />} />
            <Route path="/quizzes/all" element={<Questions mode="all" />} />
            <Route path="/notes" element={<Notes />} />
          </Routes>
        </div>
        {!isQuestionPage && <Sidebar />}
      </div>

      <FloatingNote />
    </>
  );
}

export default App;
