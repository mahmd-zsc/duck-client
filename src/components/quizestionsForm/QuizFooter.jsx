import { useEffect, useState } from "react";

export default function QuizFooter({
  userAnswer,
  correctAnswer,
  nextQuiz,
  onCheckAnswer,
  onNextQuiz,
  message,
  currentQuestion,
}) {
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

  // تشغيل الصوت لكلمة الإجابة الصحيحة
  const handleSpeak = (textToSpeak) => {
    if (!textToSpeak || !("speechSynthesis" in window)) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "de-DE";

    const germanVoice = voices.find((voice) => voice.lang.startsWith("de"));
    if (germanVoice) {
      utterance.voice = germanVoice;
    }

    synth.cancel(); // إلغاء أي صوت شغال
    synth.speak(utterance);
  };

  // لما يضغط تحقق نشغل الصوت
  const handleCheckAnswerAndSpeak = () => {
    onCheckAnswer();
    if (currentQuestion?.answer) {
      handleSpeak(currentQuestion.answer);
    }
  };

  return (
    <div
      className={`
        ${correctAnswer && nextQuiz ? "bg-lime-200" : ""}
        ${!correctAnswer && nextQuiz ? "bg-red-400" : ""}
        h-30 border-t border-gray-400 flex justify-between items-center px-32
      `}
    >
      <div dir="ltr">
        <p className="text-lg font-bold">{message}</p>
      </div>

      {!nextQuiz ? (
        <button
          disabled={!userAnswer}
          onClick={handleCheckAnswerAndSpeak}
          className={`${
            userAnswer
              ? "bg-lime-500 hover:bg-lime-400 active:bg-lime-400 text-white cursor-pointer"
              : "bg-gray-200 text-black cursor-not-allowed"
          } font-bold px-12 py-4 rounded-2xl shadow-md transition transform duration-100 border border-black`}
        >
          تحقّق
        </button>
      ) : currentQuestion === null ? (
        <button
          onClick={onNextQuiz}
          className="bg-green-500 hover:bg-green-400 active:bg-green-400 text-white font-bold px-12 py-4 rounded-2xl shadow-md transition transform duration-100 cursor-pointer border border-black"
        >
          متابعة
        </button>
      ) : (
        <button
          onClick={onNextQuiz}
          className={`${
            correctAnswer
              ? "bg-lime-500 hover:bg-lime-400 active:bg-lime-400"
              : "bg-red-500 hover:bg-red-600 active:bg-red-400"
          } text-white font-bold px-12 py-4 rounded-2xl shadow-md transition transform duration-100 cursor-pointer border border-black`}
        >
          متابعة
        </button>
      )}
    </div>
  );
}
