import React, { useState, useEffect } from "react";

function SentenceOrderQuestion({
  question,
  setUserAnswer,
  nextQuiz,
  setMessage,
}) {
  const [availableWords, setAvailableWords] = useState(question.words);
  const [selectedWords, setSelectedWords] = useState([]);

  // إعادة تعيين الحالة عند تغيير السؤال
  useEffect(() => {
    setAvailableWords(question.words);
    setSelectedWords([]);
    setUserAnswer([]);
  }, [question, setUserAnswer]);

  useEffect(() => {
    if (nextQuiz) {
      const correctSentence = question.answer;
      const translation = question.meaning;
      setMessage(`${correctSentence} - ${translation}`);

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(correctSentence);
        utterance.lang = "de-DE";
        window.speechSynthesis.speak(utterance);
      } else {
        console.log("Speech synthesis not supported in this browser.");
      }
    }
  }, [nextQuiz, question.answer, question.meaning, setMessage]);

  const selectWord = (word) => {
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);
    setAvailableWords(availableWords.filter((w) => w !== word));
    setUserAnswer(newSelected);
  };

  const removeWord = (word) => {
    const updated = selectedWords.filter((w) => w !== word);
    setSelectedWords(updated);
    setAvailableWords([...availableWords, word]);
    setUserAnswer(updated);
  };

  const isCorrect =
    nextQuiz && selectedWords.join(" ").trim() === question.answer.trim();

  return (
    <div className="flex flex-col items-center gap-6 w-full px-60">
      <h2 className="text-xl font-bold">رتب الجملة دي بالترتيب الصح:</h2>

      <div
        className="flex flex-wrap gap-3 min-h-[60px] border-2 border-b-4 rounded border-gray-300 p-4 w-full transition-all duration-300"
        dir="ltr"
      >
        {selectedWords.length === 0 && !nextQuiz && (
          <p className="text-gray-400 w-full text-right" dir="rtl">
            اضغط على الكلمات تحت عشان ترتب الجملة
          </p>
        )}
        {selectedWords.map((word, idx) => (
          <button
            key={idx}
            onClick={() => !nextQuiz && removeWord(word)}
            disabled={nextQuiz}
            className={`px-4 py-2 rounded border-2 border-b-4 cursor-pointer text-base font-medium transition-all duration-150 ${
              nextQuiz
                ? isCorrect
                  ? "bg-green-200 border-green-500 text-green-700"
                  : "bg-red-200 border-red-500 text-red-700"
                : "bg-blue-100 border-blue-400 hover:bg-blue-200 text-blue-600"
            }`}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 w-full mt-4" dir="ltr">
        {availableWords.map((word, idx) => (
          <button
            key={idx}
            onClick={() => selectWord(word)}
            disabled={nextQuiz}
            className="px-4 py-2 border-2 border-b-4 rounded cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-150"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SentenceOrderQuestion;
