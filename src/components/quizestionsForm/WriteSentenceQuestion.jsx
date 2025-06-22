import React, { useEffect, useState } from "react";
import GermanSpecialCharsButtons from "./GermanSpecialCharsButtons";
import { FaVolumeUp, FaEye, FaEyeSlash } from "react-icons/fa";

function WriteSentenceQuestion({
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
      const v = synth.getVoices();
      if (v.length) setVoices(v);
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

  useEffect(() => {
    if (nextQuiz) {
      const correct = question.answer?.trim().toLowerCase();
      const user = userAnswer?.trim().toLowerCase();
      if (user !== correct) {
        setMessage(`${question.answer} : الإجابة الصحيحة`);
      }
    }
  }, [nextQuiz, question.answer, userAnswer, setMessage]);

  const handleChange = (e) => {
    if (!nextQuiz) setUserAnswer(e.target.value);
  };

  const handleInsertChar = (char) => {
    if (!nextQuiz) setUserAnswer((prev) => (prev || "") + char);
  };

  const speakAnswer = () => {
    if (!voices.length) return;
    const germanVoices = voices.filter((v) =>
      v.lang.toLowerCase().includes("de")
    );
    const voice = germanVoices[0] || voices[0];

    const utter = new SpeechSynthesisUtterance(question.answer);
    utter.voice = voice;
    utter.lang = voice.lang;
    utter.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const toggleQuestion = () => {
    setShowQuestion(!showQuestion);
  };

  let inputClass =
    "px-6 py-5 border-2 border-b-4 text-lg min-h-[110px] rounded w-full outline-none duration-200 placeholder:text-right resize-none ";

  if (nextQuiz) {
    const correct = question.answer?.trim().toLowerCase();
    const user = userAnswer?.trim().toLowerCase();
    if (user === correct) {
      inputClass += "bg-lime-200 border-green-500 text-green-700";
    } else {
      inputClass += "bg-red-200 border-red-500 text-red-700";
    }
  } else {
    if (userAnswer) inputClass += "bg-blue-200 border-blue-500 text-blue-700";
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
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-3 max-w-4xl">
              <h2 className="text-xl font-bold text-center text-gray-700">
                {question?.question}
              </h2>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full px-20 lg:px-60">
        <div className="flex items-start gap-3">
          {/* input الجملة */}
          <input
            dir="ltr"
            type="text"
            value={userAnswer}
            onChange={handleChange}
            placeholder="اكتب الجملة هنا ✍️"
            className={inputClass}
          />

          {/* زر الصوت */}
          <button
            onClick={speakAnswer}
            className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors h-fit"
            title="اسمع الجملة"
          >
            <FaVolumeUp className="text-indigo-600 text-xl" />
          </button>
        </div>

        {/* حروف خاصة */}
        <GermanSpecialCharsButtons onInsertChar={handleInsertChar} />
      </div>

      {/* تذييل */}
      <div className="text-sm text-gray-400 text-center mt-4">
        {showQuestion
          ? "اكتب الجملة المطلوبة في الخانة أعلاه"
          : "استمع للجملة أولاً، ثم اكتشف السؤال إذا احتجت"}
      </div>
    </div>
  );
}

export default WriteSentenceQuestion;
