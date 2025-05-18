import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  fetchGeneratedQuizzes } from "../redux/slices/quizSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const correctSound = new Audio("../../sounds/correct.mp3");
const wrongSound = new Audio("../../sounds/wrong.mp3");
const vectorSound = new Audio("../../sounds/vectory.mp3");
correctSound.volume = 0.2;
wrongSound.volume = 0.2;
vectorSound.volume = 0.5;
// Components
import QuizFooter from "../components/quizestionsForm/QuizFooter";
import QuizHeader from "../components/quizestionsForm/QuizHeader";
import QuizProgressBar from "../components/quizestionsForm/QuizProgressBar";

// Questions Types
import PluralQuestion from "../components/quizestionsForm/pluralQuestion";
import WriteWordQuestion from "../components/quizestionsForm/WriteWordQuestion";
import ArticleQuestion from "../components/quizestionsForm/ArticleQuestion";
import PronunciationQuestion from "../components/quizestionsForm/PronunciationQuestion";
import AntonymQuestion from "../components/quizestionsForm/AntonymQuestion";
import SynonymQuestion from "../components/quizestionsForm/SynonymQuestion";
import SentenceOrderQuestion from "../components/quizestionsForm/SentenceOrderQuestion";
import TranslationQuestion from "../components/quizestionsForm/translationQuestion";
import Loading from "../components/quizestionsForm/Loading";
import WriteSentenceQuestion from "../components/quizestionsForm/WriteSentenceQuestion";

export default function Questions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: lessonId } = useParams();

  const [questionsQueue, setQuestionsQueue] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [nextQuiz, setNextQuiz] = useState(false);
  const [message, setMessage] = useState("");
  const { quizzes, loading } = useSelector((state) => state.quiz);

  const handleCheckAnswer = () => {
    handleAnswer(userAnswer);
  };

  useEffect(() => {
    const groupSize = searchParams.get("groupSize");
    const lessonId = searchParams.get("lessonId");
    const groupNumber = searchParams.get("groupNumber");
    if (lessonId && groupSize && groupNumber) {
      dispatch(fetchGeneratedQuizzes({ lessonId, groupSize, groupNumber }));
    }
  }, [dispatch, lessonId, searchParams]);

  useEffect(() => {
    if (quizzes.length > 0) {
      setQuestionsQueue(quizzes);
      setCurrentQuestion(quizzes[0]);
    }
    console.log(quizzes);
  }, [quizzes]);

  const normalize = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:]$/, "")
      .replace(/^\./, "")
      .replace(/\s+/g, " ");

  const handleAnswer = (userAnswerInput) => {
    if (!currentQuestion) return;

    let normalizedAnswer = "";

    if (Array.isArray(userAnswerInput)) {
      normalizedAnswer = normalize(userAnswerInput.join(" "));
    } else if (typeof userAnswerInput === "string") {
      normalizedAnswer = normalize(userAnswerInput);
    }

    let correctAnswerText = "";

    if (currentQuestion.type === "writeword") {
      correctAnswerText = normalize(currentQuestion.correctAnswer || "");
    } else if (currentQuestion.type === "sentenceorder") {
      correctAnswerText = normalize(
        (currentQuestion.correctAnswer || []).join(" ")
      );
    } else {
      correctAnswerText = normalize(currentQuestion.answer || "");
    }

    const isCorrect = normalizedAnswer === correctAnswerText;

    setUserAnswer(userAnswerInput);
    setCorrectAnswer(isCorrect);
    setNextQuiz(true);

    if (isCorrect) {
      correctSound.play();
      const positiveMessages = [
        "أحسنت",
        "شغل جامد",
        "ممتاز",
        "جميل جدًا",
        "كده الشغل ولا بلاش",
        "كده تمام",
      ];
      const randomMessage =
        positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      setMessage(randomMessage);
    } else {
      wrongSound.play();
    }
  };

  const handleNextQuiz = () => {
    const updatedQueue = [...questionsQueue];
    const current = updatedQueue.shift();

    if (!correctAnswer) updatedQueue.push(current);

    setQuestionsQueue(updatedQueue);
    setCurrentQuestion(updatedQueue[0] || null);

    const progress =
      ((quizzes.length - updatedQueue.length) / quizzes.length) * 100;
    setProgressPercentage(progress);

    setUserAnswer("");
    setCorrectAnswer(null);
    setNextQuiz(false);
    setMessage("");
  };

  // ✅ هنا بقى بنديف اختصار Enter
  const handleEnter = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!nextQuiz) {
          if (userAnswer) handleCheckAnswer();
        } else {
          handleNextQuiz();
        }
      }
    },
    [nextQuiz, userAnswer]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, [handleEnter]);

  const renderQuestion = () => {
    if (!currentQuestion) {
      vectorSound.play();
      // لما الأسئلة تخلص، عرض رسالة وزر الرجوع للصفحة الرئيسية
      return (
        <div className="text-center mt-20">
          <p className="text-2xl mb-6">تم الانتهاء من كل الأسئلة 🎉</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ارجع للصفحة الرئيسية
          </button>
        </div>
      );
    }

    const type = currentQuestion.type?.toLowerCase();

    switch (type) {
      case "writeword":
        return (
          <WriteWordQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "article":
        return (
          <ArticleQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "plural":
        return (
          <PluralQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "pronunciation":
        return (
          <PronunciationQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "antonym":
        return (
          <AntonymQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "synonym":
        return (
          <SynonymQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "sentenceorder":
        return (
          <SentenceOrderQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "translation":
        return (
          <TranslationQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            correctAnswer={correctAnswer}
            setMessage={setMessage}
          />
        );
      case "writesentence":
        return (
          <WriteSentenceQuestion
            question={currentQuestion}
            userAnswer={userAnswer}
            setUserAnswer={setUserAnswer}
            nextQuiz={nextQuiz}
            setMessage={setMessage}
          />
        );

      default:
        return <p className="text-red-500">نوع السؤال غير مدعوم 😅</p>;
    }
  };

  return (
    <div dir="rtl" className="flex flex-col min-h-screen">
      <QuizHeader title="German - الحديث عن أين تعيش" />

      <div className="flex-1 mx-32">
        <div className="mx-32">
          <QuizProgressBar percentage={progressPercentage} />
        </div>

        <div className="mt-10">{loading ? <Loading /> : renderQuestion()}</div>
      </div>

      {currentQuestion && !loading && (
        <QuizFooter
          userAnswer={userAnswer}
          correctAnswer={correctAnswer}
          nextQuiz={nextQuiz}
          onCheck={handleCheckAnswer}
          onNext={handleNextQuiz}
          message={message}
        />
      )}
    </div>
  );
}
