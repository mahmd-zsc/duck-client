import React, { useEffect, useState } from "react";

function ArticleQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
  correctAnswer,
}) {
  const [voices, setVoices] = useState([]);

  // نجيب الأصوات
  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const available = synth.getVoices();
      if (available.length) setVoices(available);
    };
    synth.addEventListener("voiceschanged", loadVoices);
    loadVoices();
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  // لما nextQuiz يبقى true، ننطق “المعرف + الكلمة”
  useEffect(() => {
    if (nextQuiz && voices.length) {
      const german = voices.find((v) => v.lang.toLowerCase().includes("de"));
      const voice = german || voices[0];

      // نستخرج الكلمة بين علامات التنصيص في السؤال
      const match = question.question.match(/['"](.+?)['"]/);
      const noun = match ? match[1] : question.answer;

      const textToSpeak = `${question.answer} ${noun}`;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.voice = voice;
      utterance.lang = voice.lang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }, [nextQuiz, voices, question.question, question.answer]);

  const handleOptionChange = (option) => {
    if (!nextQuiz) setUserAnswer(option);
  };

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
            const thisOpt = option.trim().toLowerCase();

            if (thisOpt === correctAns) {
              optionClass = "bg-lime-200 border-green-500 text-green-700 ";
            } else if (thisOpt === userAns && userAns !== correctAns) {
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
                name="articleOption"
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

export default ArticleQuestion;
