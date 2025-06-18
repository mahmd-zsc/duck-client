import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGeneratedQuizzes } from "../redux/slices/quizSlice";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const correctSound = new Audio("/sounds/correct.mp3");
const wrongSound = new Audio("/sounds/wrong.mp3");

correctSound.volume = 0.2;
wrongSound.volume = 0.2;

import QuizFooter from "../components/quizestionsForm/QuizFooter";
import QuizHeader from "../components/quizestionsForm/QuizHeader";
import QuizProgressBar from "../components/quizestionsForm/QuizProgressBar";

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
import IntroQuestion from "../components/quizestionsForm/IntroQuestion";
import QuizComplete from "../components/quizestionsForm/QuizComplete";
import FillInTheBlanksQuestion from "../components/quizestionsForm/FillInTheBlanksQuestion";
import FillintheblanksIntro from "../components/quizestionsForm/FillintheblanksIntro";

export default function Questions() {
  const dispatch = useDispatch();
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
  const { wordIds } = useSelector((state) => state.word);
  let quizzesList = quizzes.quizzes;
  const [wrongAttemptsMap, setWrongAttemptsMap] = useState({});
  const [hardWordsSet, setHardWordsSet] = useState(new Set());
  const [hardCandidates, setHardCandidates] = useState([]);
  const handleCheckAnswer = () => {
    handleAnswer(userAnswer);
  };
  useEffect(() => {
    document.title = "Lexi - اسئلة"; // غيّر الاسم اللي إنت عايزه
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const groupSize = searchParams.get("groupSize");
      const lessonId = searchParams.get("lessonId");
      const groupNumber = searchParams.get("groupNumber");
      const mode = searchParams.get("mode");

      // ✅ استنى لحد ما wordIds تكون جاهزة في حالة مفيش lessonId
      if (!lessonId && (!wordIds || wordIds.length === 0) && !mode) return;

      let payload = { groupSize, groupNumber, mode };

      if (lessonId) {
        payload.lessonId = lessonId;
        console.log("✔ with lessonId");
      }
      payload.wordIds = wordIds;
      await console.log("😭 payload : ", payload);
      await dispatch(fetchGeneratedQuizzes(payload));
    };

    fetchData();
  }, [dispatch, searchParams, wordIds]);

  useEffect(() => {
    if (quizzesList?.length > 0) {
      setQuestionsQueue(quizzesList);
      setCurrentQuestion(quizzesList[0]);
    }
  }, [quizzes]);

  const normalize = (str) => {
    if (typeof str !== "string") {
      // لو الإدخال مش سترينج، حاول تحويله إلى سترينج أو رجع فارغ
      if (str == null) return "";
      return String(str)
        .trim()
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟،]/g, "")
        .replace(/\s{2,}/g, " ");
    }
    return str
      .trim()
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()؟،]/g, "")
      .replace(/\s{2,}/g, " ");
  };

  const handleAnswer = (userAnswerInput) => {
    //console.log(currentQuestion.type);
    if (!currentQuestion) return;
    let normalizedAnswer = "";
    let correctAnswerText = "";
    let isCorrect = false;
    if (currentQuestion.type === "fillintheblanksintro") {
      setNextQuiz(true);
      isCorrect = true;
      setCorrectAnswer(isCorrect);
      setNextQuiz(true);
    } else {
      const normalizeInput = (input) => {
        if (Array.isArray(input)) {
          return normalize(input.join(" "));
        }
        if (typeof input === "string") {
          return normalize(input);
        }
        if (typeof input === "object" && input !== null) {
          return normalize(Object.values(input).join(" "));
        }
        return "";
      };

      if (currentQuestion.type === "fillInTheBlanks") {
        const userEntries = Object.values(userAnswerInput || {}).map(normalize);
        const correctEntries = Object.values(currentQuestion.answer || {}).map(
          normalize
        );
        isCorrect =
          userEntries.length === correctEntries.length &&
          userEntries.every((val, i) => val === correctEntries[i]);
        setUserAnswer(userAnswerInput);
      } else {
        normalizedAnswer = normalizeInput(userAnswerInput);

        if (currentQuestion.type === "writeword") {
          correctAnswerText = normalize(currentQuestion.correctAnswer || "");
        } else if (currentQuestion.type === "sentenceorder") {
          correctAnswerText = normalizeInput(currentQuestion.correctAnswer);
        } else {
          correctAnswerText = normalize(currentQuestion.answer || "");
        }

        isCorrect = normalizedAnswer === correctAnswerText;
        setUserAnswer(userAnswerInput);
      }

      setCorrectAnswer(isCorrect);
      setNextQuiz(true);
    }

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
      let wordId = currentQuestion._id;
      setWrongAttemptsMap((prev) => {
        const currentAttempts = prev[wordId] || 0;
        const newAttempts = currentAttempts + 1;

        // لو المحاولات وصلت 2 والكلمة مش hard قبل كده
        if (newAttempts === 2 && !hardWordsSet.has(wordId)) {
          setHardCandidates((prevArray) => [...prevArray, wordId]);
        }

        return { ...prev, [wordId]: newAttempts };
      });
    }
  };

  const handleNextQuiz = () => {
    const updatedQueue = [...questionsQueue];
    const current = updatedQueue.shift();
    if (!correctAnswer) {
      if (current.type === "fillInTheBlanks") {
        const introQuestion = {
          ...current,
          type: "fillintheblanksintro",
          isReviewed: true,
        };
        console.log(introQuestion);
        updatedQueue.unshift(introQuestion);
        updatedQueue.push(current);
      } else {
        const introQuestion = {
          ...current,
          type: "intro",
          isReviewed: true,
        };
        updatedQueue.unshift(introQuestion);
        updatedQueue.push(current);
      }
    }

    setQuestionsQueue(updatedQueue);
    setCurrentQuestion(updatedQueue[0] || null);

    const progress =
      ((quizzesList.length - updatedQueue.length) / quizzesList.length) * 100;
    setProgressPercentage(progress);

    setUserAnswer("");
    setCorrectAnswer(null);
    setNextQuiz(false);
    setMessage("");
  };

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

  const baseProps = {
    question: currentQuestion,
    userAnswer,
    setUserAnswer,
    nextQuiz,
    correctAnswer,
    setMessage,
  };
  const renderQuestion = () => {
    if (!loading && !currentQuestion) {
      return (
        <QuizComplete
          quizzesList={quizzesList}
          hardCandidates={hardCandidates}
          mode={quizzes.mode}
        />
      );
    }

    const type = currentQuestion.type?.toLowerCase();
    switch (type) {
      case "intro":
        return <IntroQuestion {...baseProps} />;
      case "fillintheblanksintro":
        return <FillintheblanksIntro {...baseProps} />;
      case "writeword":
        return <WriteWordQuestion {...baseProps} />;
      case "article":
        return <ArticleQuestion {...baseProps} />;
      case "plural":
        return <PluralQuestion {...baseProps} />;
      case "pronunciation":
        return <PronunciationQuestion {...baseProps} />;
      case "antonym":
        return <AntonymQuestion {...baseProps} />;
      case "synonym":
        return <SynonymQuestion {...baseProps} />;
      case "sentenceorder":
        return <SentenceOrderQuestion {...baseProps} />;
      case "translation":
        return <TranslationQuestion {...baseProps} />;
      case "fillintheblanks":
        return <FillInTheBlanksQuestion {...baseProps} />;
      case "writesentence":
        return <WriteSentenceQuestion {...baseProps} />;
      default:
        return <p className="text-red-500">نوع السؤال غير مدعوم 😅</p>;
    }
  };

  return (
    <div dir="rtl" className="flex flex-col min-h-screen">
      <QuizHeader title={quizzes.titleOfLesson} />

      <div className="flex-1 flex flex-col mx-32">
        <div className="mx-32">
          <QuizProgressBar percentage={progressPercentage} />
        </div>

        <div className="mt-5 flex-1">
          {loading ? <Loading /> : renderQuestion()}
        </div>
      </div>

      {currentQuestion && !loading && (
        <QuizFooter
          message={message}
          nextQuiz={nextQuiz}
          onCheckAnswer={handleCheckAnswer}
          onNextQuiz={handleNextQuiz}
          userAnswer={userAnswer}
          correctAnswer={correctAnswer}
          currentQuestion={currentQuestion}
        />
      )}
    </div>
  );
}
