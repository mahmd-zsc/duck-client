// src/components/quizestionsForm/QuizFooter.jsx
export default function QuizFooter({
  userAnswer,
  correctAnswer,
  nextQuiz,
  onCheck,
  onNext,
  message,
  currentQuestion,
}) {
  return (
    <div
      className={`
        ${correctAnswer && nextQuiz ? `bg-lime-200` : ""}
        ${!correctAnswer && nextQuiz ? `bg-red-400` : ""}
        h-30 border-t border-gray-400 flex justify-between items-center px-32
      `}
    >
      <div dir="ltr">
        <p className="text-lg font-bold">{message}</p>
      </div>

      {!nextQuiz ? (
        <button
          disabled={!userAnswer}
          onClick={onCheck}
          className={`${
            userAnswer
              ? "bg-lime-500 hover:bg-lime-400 active:bg-lime-400 text-white cursor-pointer"
              : "bg-gray-200 text-black cursor-not-allowed"
          } font-bold px-12 py-4 rounded-2xl shadow-md transition transform duration-100 border border-black`}
        >
          تحقّق
        </button>
      ) : currentQuestion === null ? (
        <button
          onClick={onNext}
          className="bg-green-500 hover:bg-green-400 active:bg-green-400 text-white font-bold px-12 py-4 rounded-2xl shadow-md transition transform duration-100 cursor-pointer border border-black"
        >
          متابعة
        </button>
      ) : (
        <button
          onClick={onNext}
          className={`${
            correctAnswer
              ? "bg-lime-500 hover:bg-lime-400 active:bg-lime-400"
              : "bg-red-500 hover:bg-red-600 active:bg-red-400"
          } text-white font-bold px-12 py-4 rounded-2xl shadow-md transition transform duration-100 cursor-pointer border border-black`}
        >
          متابعة
        </button>
      )}
    </div>
  );
}
