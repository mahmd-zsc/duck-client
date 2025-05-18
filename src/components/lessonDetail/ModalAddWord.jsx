import React, { useState } from "react";
import { addWordApi } from "../../redux/apiCalls/wordApi";
import { createPortal } from "react-dom";

function ModalAddWord({ showModal, setShowModal, lessonId }) {
  const [jsonInput, setJsonInput] = useState(""); // حقل لتخزين JSON المدخل
  const [error, setError] = useState(null); // لتخزين رسائل الخطأ

  const handleAddWords = async () => {
    try {
      const parsedWords = JSON.parse(jsonInput);

      for (const word of parsedWords) {
        await addWordApi({ ...word, lessonId });
      }
      console.log(error);
      setJsonInput("[]");
      setShowModal(false);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowModal(false);
    }
  };

  if (!showModal) return null;

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="overlay fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn"
      style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
    >
      <div
        className="p-8 w-[90%] max-w-xl animate-popIn border"
        style={{
          borderRadius: "34px",
          background: "#fff",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Add Multiple Words 📚
        </h3>

        <div className="mb-4">
          <label className="block font-semibold text-gray-600 mb-2">
            Enter Words (JSON format)
          </label>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows="8"
            className="w-full p-3 border border-gray-300 rounded-xl"
            placeholder='مثال: [{"word": "Haus", "meaning": "منزل", "pronunciation": "هاوس", ...}]'
          />
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="w-full py-3 rounded-full border border-black hover:scale-105 duration-300 bg-gray-200 text-gray-800 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAddWords}
            className="w-full py-3 rounded-full border border-black hover:scale-105 duration-300 bg-[#FC8716] text-white cursor-pointer"
          >
            Add Words
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ModalAddWord;
