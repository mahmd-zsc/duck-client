import React, { useEffect, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

function IntroQuestion({ question, setUserAnswer, userAnswer }) {
  const [voices, setVoices] = useState([]);

  // تحميل الأصوات
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
    setUserAnswer(question.answer);
  }, [userAnswer]);
  // دالة تشغيل الصوت
  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        question.word ? question.word : question.answer
      );
      utterance.lang = "de-DE";

      const germanVoice = voices.find((voice) => voice.lang.startsWith("de"));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      window.speechSynthesis.cancel(); // يوقف أي صوت تاني
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full text-gray-700  p-8">
      {/* العنوان الرئيسي */}
      <div className="w-full text-center">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
          {question.isReviewed ? "راجع كويس" : "تعلم الجديد"}
        </h2>
        <div className="h-1 w-20 bg-indigo-300 mx-auto rounded-full"></div>
      </div>

      {/* الكلمة وعناصر التحكم */}
      <div className="flex flex-col items-center gap-4 w-full">
        {/* الكلمة باللغة العربية */}
        <div className="flex items-center gap-4">
          <h1
            className="text-5xl font-bold text-gray-800 text-center"
            dir="ltr"
          >
            {question.word ? question.word : question.answer}
          </h1>
          <button
            onClick={handleSpeak}
            className="p-3 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
          >
            <FaVolumeUp className="text-indigo-600 text-xl" />
          </button>
        </div>

        {/* المعنى والنطق */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xl text-gray-600 font-medium">
            {question.meaning}
          </div>
          <div className="text-lg text-indigo-500 font-medium">
            {question.pronunciation || ""}
          </div>
        </div>
      </div>

      {/* تذييل */}
      <div className="text-sm text-gray-400 mt-4">استمع جيدًا وحاول ترديد</div>
    </div>
  );
}

export default IntroQuestion;
