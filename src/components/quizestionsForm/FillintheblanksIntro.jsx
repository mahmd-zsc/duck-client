import React, { useEffect, useState } from "react";
import { FaVolumeUp } from "react-icons/fa";

function FillInTheBlanksIntro({ question, setUserAnswer, userAnswer }) {
  const [voices, setVoices] = useState([]);

  // تحميل الأصوات المتاحة
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length) {
        setVoices(availableVoices);
      } else {
        setTimeout(loadVoices, 100);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // تحميل الإجابات النموذجية أول مرة
  useEffect(() => {
    setUserAnswer(question.answer);
    console.log(question.answer)
  }, []);

  // دالة نطق معدلة حسب الطلب
  const handleSpeak = (pronoun, conjugation) => {
    if ("speechSynthesis" in window) {
      let textToSpeak = conjugation;
      
      // إذا كان الضمير من نوع sie (she) أو sie (they) ننطق sie فقط
      if (pronoun.includes("(")) {
        textToSpeak = `sie ${conjugation}`;
      } else {
        textToSpeak = `${pronoun} ${conjugation}`;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "de-DE";

      // اختيار صوت ألماني إذا كان متاحًا
      const germanVoice = voices.find((voice) => voice.lang.startsWith("de"));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }

      window.speechSynthesis.cancel(); // إيقاف أي صوت قيد التشغيل
      window.speechSynthesis.speak(utterance);
    }
  };

  // دالة لتنسيق عرض الضمائر
  const formatPronoun = (pronoun) => {
    switch(pronoun) {
      case "sieShe": return "sie (she)";
      case "sieThey": return "sie (they)";
      default: return pronoun;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full text-gray-700 p-8">
      {/* العنوان */}
      <div className="w-full text-center">
        <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
          {question.isReviewed ? "راجع التصريفات" : "تعلم تصريفات جديدة"}
        </h2>
        <div className="h-1 w-24 bg-indigo-300 mx-auto rounded-full"></div>
      </div>

      {/* الفعل الأساسي */}
      <div className="text-center mt-2">
        <h1 className="text-4xl font-bold text-gray-800">{question.verb}</h1>
        <p className="text-sm text-gray-500 mt-1">
          تصريف الفعل مع الضمائر المختلفة
        </p>
      </div>

      {/* جدول التصريفات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-2xl">
        {Object.entries(userAnswer).map(([pronounKey, conjugation]) => {
          const formattedPronoun = formatPronoun(pronounKey);
          return (
            <div
              key={pronounKey}
              className="flex justify-between items-center bg-indigo-50 rounded-xl p-4 shadow-sm"
            >
              <div className="text-lg font-medium text-gray-700">{formattedPronoun}</div>
              <div className="flex items-center gap-3">
                <span className="text-lg text-indigo-600 font-semibold">
                  {conjugation}
                </span>
                <button
                  onClick={() => handleSpeak(formattedPronoun, conjugation)}
                  className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition-colors"
                >
                  <FaVolumeUp className="text-indigo-600 text-lg" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-sm text-gray-400 mt-6">
        استمع لكل تصريف وردد مع النطق 💬
      </div>
    </div>
  );
}

export default FillInTheBlanksIntro;