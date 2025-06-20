import React, { useEffect, useState } from "react";
import GermanSpecialCharsButtons from "./GermanSpecialCharsButtons";
import { FaVolumeUp } from "react-icons/fa"; // ✅ أيقونة السماعة

function WriteWordQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
  setMessage,
}) {
  const [voices, setVoices] = useState([]);

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
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-bold">{question?.question}</h2>

      <div className="flex flex-col gap-3 mt-4 w-full px-60">
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
    </div>
  );
}

export default WriteWordQuestion;
