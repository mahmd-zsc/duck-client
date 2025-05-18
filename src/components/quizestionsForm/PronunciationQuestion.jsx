import React, { useState, useEffect } from "react";

function PronunciationQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const shuffleArray = (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  useEffect(() => {
    let options = [...question.options];

    if (!options.find((opt) => opt.word === question.answer)) {
      options.push({
        word: question.answer,
        meaning: question.meaning || "",
        pronunciation: question.pronunciation || "",
      });
    }

    setShuffledOptions(shuffleArray(options));
  }, [question]);

  const handleOptionChange = (optionWord) => {
    if (!nextQuiz) {
      setUserAnswer(optionWord);
    }
  };

  const playPronunciation = () => {
    if (!window.speechSynthesis) {
      alert("جهازك مش بيدعم تشغيل الصوت");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(question.answer);
    utterance.lang = "de-DE";

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-bold">{question?.question}</h2>

      <button
        onClick={playPronunciation}
        disabled={isPlaying}
        className="mb-4 px-5 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 transition"
      >
        {isPlaying ? "بيشتغل الصوت..." : "اسمع النطق 🔊"}
      </button>

      <div className="flex flex-col gap-3 mt-4 w-full max-w-md">
        {shuffledOptions.map((option, idx) => {
          let optionClass =
            "bg-white hover:bg-gray-200 duration-200 border-gray-200 text-gray-700 ";

          if (nextQuiz) {
            const correctAns = question.answer?.trim().toLowerCase();
            const userAns = userAnswer?.trim().toLowerCase();
            const thisOption = option.word.trim().toLowerCase();

            if (thisOption === correctAns) {
              optionClass = "bg-lime-200 border-green-500 text-green-700 ";
            } else if (thisOption === userAns && userAns !== correctAns) {
              optionClass = "bg-red-200 border-red-500 text-red-700";
            }
          } else {
            if (option.word === userAnswer) {
              optionClass = "bg-blue-200 border-blue-500 text-blue-700";
            }
          }

          return (
            <label
              key={idx}
              className={`px-10 py-3 border-2 border-b-4 rounded cursor-pointer flex items-center justify-between  ${optionClass}`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`border border-b-4 px-2 rounded ${optionClass}`}
                >
                  <span>{idx + 1}</span>
                </div>

                <input
                  type="radio"
                  name="pronunciationOption"
                  value={option.word}
                  checked={userAnswer === option.word}
                  onChange={() => handleOptionChange(option.word)}
                  className="mr-2 appearance-none"
                  disabled={nextQuiz} // عشان متتغيرش بعد لما تظهر الإجابة
                />

                <div className="flex flex-col">
                  <span>{option.word}</span>
                </div>
              </div>
              <div>
                {nextQuiz && option.meaning && (
                  <small className="text-gray-500">
                    {option.meaning} - {option.pronunciation}
                  </small>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default PronunciationQuestion;
