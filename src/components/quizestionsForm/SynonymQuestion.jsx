import React, { useEffect, useState } from "react";

function SynonymQuestion({ question, userAnswer, setUserAnswer, nextQuiz , setMessage }) {
  const [spokenAfterCheck, setSpokenAfterCheck] = useState(false);

  // دالة واحدة لتشغيل الصوت
  const speak = (word) => {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "de-DE";
    const germanVoice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang.startsWith("de"));
    if (germanVoice) utterance.voice = germanVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // ينطق الكلمة عند الاختيار
  const handleOptionChange = (optionWord) => {
    if (!nextQuiz) {
      speak(optionWord);
      setUserAnswer(optionWord);
    }
  };

  // ينطق الإجابة الصح بعد التحقق مرة واحدة
  useEffect(() => {
    if (nextQuiz && !spokenAfterCheck) {
      speak(question.answer);
      setSpokenAfterCheck(true);
      setMessage(question.meaning);
    } else if (!nextQuiz) {
      setSpokenAfterCheck(false); // سؤال جديد
    }
  }, [nextQuiz, question.answer, spokenAfterCheck]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-bold">{question?.question}</h2>

      <div className="flex flex-col gap-3 mt-4 w-full max-w-md">
        {question.options.map((option, idx) => {
          const opt =
            typeof option === "string"
              ? { word: option, meaning: "", pronunciation: "" }
              : option;

          let optionClass =
            "bg-white hover:bg-gray-200 duration-200 border-gray-200 text-gray-700 ";
          const correctAns = question.answer?.trim().toLowerCase();
          const userAns = userAnswer?.trim().toLowerCase();
          const thisOption = opt.word.trim().toLowerCase();

          if (nextQuiz) {
            if (thisOption === correctAns)
              optionClass = "bg-lime-200 border-green-500 text-green-700 ";
            else if (thisOption === userAns && userAns !== correctAns)
              optionClass = "bg-red-200 border-red-500 text-red-700";
          } else if (opt.word === userAnswer) {
            optionClass = "bg-blue-200 border-blue-500 text-blue-700";
          }

          return (
            <label
              key={idx}
              className={`px-10 py-6 border-2 border-b-4 rounded cursor-pointer flex justify-between items-center ${optionClass}`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`border border-b-4 px-2 rounded ${optionClass}`}
                >
                  <span>{idx + 1}</span>
                </div>

                <input
                  type="radio"
                  name="synonymOption"
                  value={opt.word}
                  checked={userAnswer === opt.word}
                  onChange={() => handleOptionChange(opt.word)}
                  className="mr-2 appearance-none"
                  disabled={nextQuiz}
                />

                <span>{opt.word}</span>
              </div>

              {/* المعنى والنطق بعد الحل */}
              {nextQuiz && (opt.meaning || opt.pronunciation) && (
                <small className="text-gray-600 italic">
                  {opt.meaning} - {opt.pronunciation}
                </small>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default SynonymQuestion;
