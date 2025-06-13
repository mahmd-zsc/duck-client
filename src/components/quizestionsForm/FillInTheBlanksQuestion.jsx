import React, { useState, useEffect } from "react";

export default function FillInTheBlanksQuestion({
  question,
  userAnswer,
  setUserAnswer,
  nextQuiz,
  setMessage,
}) {
  const [inputs, setInputs] = useState({});

  // تنسيق الضمير
  const formatPronoun = (pronoun) => {
    if (pronoun === "sieShe") return "sie (she)";
    if (pronoun === "sieThey") return "sie (they)";
    return pronoun;
  };

  // تهيئة الإجابات
  useEffect(() => {
    const initial = {};
    question.question.forEach((q) => {
      initial[q.pronoun] = "";
    });
    setInputs(initial);
    setUserAnswer(initial);
  }, [question]);

  const handleChange = (pronoun, value) => {
    const updated = {
      ...inputs,
      [pronoun]: value,
    };
    setInputs(updated);
    setUserAnswer(updated);
  };

  const isCorrect = (pronoun) => {
    const userVal = (inputs[pronoun] || "").trim().toLowerCase();
    const correctVal = (question.answer[pronoun] || "").trim().toLowerCase();
    return userVal === correctVal;
  };

  useEffect(() => {
    if (!nextQuiz) return;

    const allCorrect = Object.keys(inputs).every(isCorrect);
    setMessage(allCorrect ? "" : "راجع إجاباتك! ✍️");
  }, [nextQuiz]);

  return (
    <div className="flex flex-col items-center gap-6 w-full text-gray-700 p-8">
    <div className="w-full text-center">
      <h2 className="text-2xl font-bold text-indigo-600 mb-1">
        صرّف الفعل <span className="text-indigo-500">{question.verb}</span>
      </h2>
      <div className="h-1 w-24 bg-indigo-300 mx-auto rounded-full mb-4"></div>
    </div>
  
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 w-full max-w-3xl">
      {question.question.map((item, index) => {
        const pronoun = item.pronoun;
        const value = inputs[pronoun] || "";
        const correct = isCorrect(pronoun);
  
        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-center rounded-xl p-4 shadow-md transition-all
              ${
                nextQuiz
                  ? correct
                    ? "bg-green-50 border border-green-300"
                    : "bg-red-50 border border-red-300"
                  : "bg-indigo-50 border border-indigo-100"
              }`}
          >
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(pronoun, e.target.value)}
              disabled={nextQuiz}
              placeholder={
                nextQuiz && !correct ? question.answer[pronoun] : ""
              }
              className="w-full px-3 py-2 text-center text-lg font-semibold bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:opacity-50 transition"
            />
            <span className="mt-2 text-base font-medium text-gray-600">
              {formatPronoun(pronoun)}
            </span>
          </div>
        );
      })}
    </div>
  </div>
  
  );
}
