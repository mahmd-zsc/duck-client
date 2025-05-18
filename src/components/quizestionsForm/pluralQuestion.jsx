import React, { useEffect } from "react";

function PluralQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
  correctAnswer,
}) {
  const handleOptionChange = (option) => {
    if (!nextQuiz) {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(option);
        utterance.lang = "de-DE"; // نطق ألماني
        window.speechSynthesis.speak(utterance);
      }
      setUserAnswer(option);
    }
  };

  useEffect(() => {
    if (nextQuiz && correctAnswer && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(correctAnswer);
      utterance.lang = "de-DE"; // نطق ألماني
      window.speechSynthesis.speak(utterance);
    }
  }, [nextQuiz, correctAnswer]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-bold">{question?.question}</h2>

      <div className="flex flex-col gap-3 mt-4 w-full max-w-md">
        {question.options.map((option, idx) => {
          let optionClass =
            "bg-white hover:bg-gray-200 duration-200 border-gray-200 text-gray-700 ";
          if (nextQuiz) {
            const correctAns = question.answer?.trim().toLowerCase();
            const userAns = userAnswer?.trim().toLowerCase();
            const thisOption = option.trim().toLowerCase();

            if (thisOption === correctAns) {
              optionClass = "bg-lime-200 border-green-500 text-green-700 ";
            } else if (thisOption === userAns && userAns !== correctAns) {
              optionClass = "bg-red-200 border-red-500 text-red-700";
            }
          } else {
            if (option === userAnswer) {
              optionClass = "bg-blue-200 border-blue-500 text-blue-700";
            }
          }

          return (
            <label
              key={idx}
              className={`px-10 py-6 border-2 border-b-4 rounded cursor-pointer flex items-center gap-5 ${optionClass}`}
            >
              <div className={`border border-b-4 px-2 rounded ${optionClass}`}>
                <span>{idx + 1}</span>
              </div>

              <input
                type="radio"
                name="pluralOption"
                value={option}
                checked={userAnswer === option}
                onChange={() => handleOptionChange(option)}
                className="mr-2 appearance-none"
              />

              {option}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default PluralQuestion;
