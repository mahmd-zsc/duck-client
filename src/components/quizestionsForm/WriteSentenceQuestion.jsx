import React, { useEffect, useState } from "react";
import GermanSpecialCharsButtons from "./GermanSpecialCharsButtons";


function WriteSentenceQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
  setMessage,
}) {
  const [voices, setVoices] = useState([]);

  /*--- load TTS voices once ---*/
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

  /*--- speak the sentence when it's graded ---*/
  useEffect(() => {
    if (nextQuiz && voices.length) {
      const germanVoices = voices.filter((v) =>
        v.lang.toLowerCase().includes("de")
      );
      const voice = germanVoices[0] || voices[0];

      const utter = new SpeechSynthesisUtterance(question.answer);
      utter.voice = voice;
      utter.lang = voice.lang;
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    }
  }, [nextQuiz, voices, question.answer]);

  /*--- handlers ---*/
  const handleChange = (e) => {
    if (!nextQuiz) setUserAnswer(e.target.value);
  };

  const handleInsertChar = (char) => {
    if (!nextQuiz) setUserAnswer((prev) => (prev || "") + char);
  };

  /*--- styling ---*/
  let inputClass =
    "px-6 py-5 border-2 border-b-4 text-lg min-h-[110px] rounded w-full outline-none duration-200 placeholder:text-right resize-none ";

  if (nextQuiz) {
    const correct = question.answer?.trim().toLowerCase();
    const user = userAnswer?.trim().toLowerCase();
    if (user === correct) {
      inputClass += "bg-lime-200 border-green-500 text-green-700";
    } else {
      inputClass += "bg-red-200 border-red-500 text-red-700";
      setMessage(`${question.answer} : الإجابة الصحيحة`);
    }
  } else {
    if (userAnswer) inputClass += "bg-blue-200 border-blue-500 text-blue-700";
    else inputClass += "bg-white border-gray-300 text-gray-600";
  }

  /*--- render ---*/
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h2 className="text-xl font-bold">{question?.question}</h2>

      <div className="flex flex-col gap-3 mt-4 w-full px-20 lg:px-60">
        {/* textarea بدل input عشان الجملة أطول */}
        <input
          cl
          dir="ltr"
          type="text"
          value={userAnswer}
          onChange={handleChange}
          placeholder="اكتب الجملة هنا ✍️"
          className={inputClass}
        />

        {/* أزرار الحروف الخاصة */}
        <GermanSpecialCharsButtons onInsertChar={handleInsertChar} />
      </div>
    </div>
  );
}

export default WriteSentenceQuestion;
