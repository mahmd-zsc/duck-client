import React, { useState, useEffect } from "react";

function TranslationQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
}) {
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [voices, setVoices] = useState([]);

  // دالة خلط المصفوفة
  const shuffleArray = (array) => {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // جلب أصوات المتصفح مرة واحدة
  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    let options = question.options.map((opt) =>
      typeof opt === "string"
        ? { word: opt, meaning: "", pronunciation: "" }
        : opt
    );

    if (
      !options.find(
        (opt) =>
          opt.word.trim().toLowerCase() === question.answer.trim().toLowerCase()
      )
    ) {
      options.push({
        word: question.answer,
        meaning: question.meaning || "",
        pronunciation: question.pronunciation || "",
      });
    }

    setShuffledOptions(shuffleArray(options));
  }, [question]);

  const isQuestionAskingMeaning = question.question.includes("ما معنى الكلمة");

  const handleOptionChange = (optionWord) => {
    if (!nextQuiz) {
      setUserAnswer(optionWord);

      // شغل صوت الكلمة بالألماني باستخدام speechSynthesis
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(optionWord);
        utterance.lang = "de-DE";

        // اختار صوت ألماني لو متوفر
        const germanVoice = voices.find((voice) =>
          voice.lang.startsWith("de")
        );
        if (germanVoice) {
          utterance.voice = germanVoice;
        }

        window.speechSynthesis.cancel(); // وقف أي صوت شغال
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-bold">{question?.question}</h2>

      <div className="flex flex-col gap-3 mt-4 w-full px-4">
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

          const displayText = isQuestionAskingMeaning
            ? option.meaning || option.word
            : option.word;

          const translationText = isQuestionAskingMeaning
            ? option.word
            : option.meaning;

          return (
            <label
              key={idx}
              className={`px-6 py-4 border-2 border-b-4 rounded cursor-pointer flex justify-between items-center ${optionClass}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`border border-b-4 px-3 rounded ${optionClass}`}
                >
                  <span>{idx + 1}</span>
                </div>

                <input
                  type="radio"
                  name="translationOption"
                  value={option.word}
                  checked={userAnswer === option.word}
                  onChange={() => handleOptionChange(option.word)}
                  className="mr-2 appearance-none"
                  disabled={nextQuiz}
                />

                <span>{displayText}</span>
              </div>

              {nextQuiz && translationText && (
                <small className="text-gray-600 italic">{translationText} - {option.pronunciation}</small>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default TranslationQuestion;
