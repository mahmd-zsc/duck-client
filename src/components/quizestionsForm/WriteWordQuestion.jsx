import React, { useEffect, useState } from "react";
import GermanSpecialCharsButtons from "./GermanSpecialCharsButtons";
import { FaVolumeUp, FaEye, FaEyeSlash } from "react-icons/fa";

function WriteWordQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
  setMessage,
}) {
  const [voices, setVoices] = useState([]);
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const available = synth.getVoices();
      if (available.length) {
        setVoices(available);
      }
    };

    synth.addEventListener("voiceschanged", loadVoices);
    loadVoices();

    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, []);

  useEffect(() => {
    if (nextQuiz && voices.length) {
      speakAnswer();
    }
  }, [nextQuiz, voices, question.answer]);

  const handleChange = (e) => {
    if (!nextQuiz) setUserAnswer(e.target.value);
  };

  const handleInsertChar = (char) => {
    if (!nextQuiz) setUserAnswer(userAnswer + char);
  };

  const speakAnswer = () => {
    if (!voices.length) return;

    const germanVoices = voices.filter((v) =>
      v.lang.toLowerCase().includes("de")
    );
    const voice = germanVoices[0] || voices[0];

    const utterance = new SpeechSynthesisUtterance(question.answer);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const toggleQuestion = () => {
    setShowQuestion(!showQuestion);
  };

  let inputClass =
    "px-6 py-5 border-2 border-b-4 text-xl rounded w-full outline-none duration-200 placeholder:text-right ";

  if (nextQuiz) {
    const correctAns = question.answer?.trim().toLowerCase();
    const userAns = userAnswer?.trim().toLowerCase();
    if (userAns === correctAns) {
      inputClass += "bg-lime-200 border-green-500 text-green-600";
    } else {
      inputClass += "bg-red-200 border-red-500 text-red-600";
      setMessage(`${question.answer} : الاجابة الصحيحة`);
    }
  } else {
    if (userAnswer) inputClass += "bg-blue-200 border-blue-500 text-blue-600";
    else inputClass += "bg-white border-gray-300 text-gray-600";
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full  justify-center">
      {/* زر إظهار السؤال */}
      <button
        onClick={toggleQuestion}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
      >
        {showQuestion ? (
          <FaEyeSlash className="text-lg" />
        ) : (
          <FaEye className="text-lg" />
        )}
        <span>{showQuestion ? "إخفاء السؤال" : "إظهار السؤال"}</span>
      </button>

      {/* منطقة السؤال بارتفاع ثابت */}
      <div className="w-full h-16 flex items-center justify-center">
        <div
          className={`transition-opacity duration-300 ${
            showQuestion ? "opacity-100" : "opacity-0"
          }`}
        >
          {showQuestion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3">
              <h2 className="text-xl font-bold text-center text-gray-700">
                {question?.question}
              </h2>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full px-60">
        <div className="flex items-center gap-3">
          <input
            dir="ltr"
            type="text"
            value={userAnswer}
            onChange={handleChange}
            placeholder="اكتب الكلمة هنا ✍️"
            className={inputClass}
          />

          {/* زرار الصوت اليدوي */}
          <button
            onClick={speakAnswer}
            className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
            title="اسمع الكلمة"
          >
            <FaVolumeUp className="text-indigo-600 text-xl" />
          </button>
        </div>

        <GermanSpecialCharsButtons onInsertChar={handleInsertChar} />
      </div>

      {/* تذييل */}
      <div className="text-sm text-gray-400 text-center">
        {showQuestion
          ? "اكتب الكلمة المطلوبة في الخانة أعلاه"
          : "استمع للكلمة أولاً، ثم اكتشف السؤال إذا احتجت"}
      </div>
    </div>
  );
}

export default WriteWordQuestion;
