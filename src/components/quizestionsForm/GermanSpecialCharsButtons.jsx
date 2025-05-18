import React from "react";

const specialChars = ["ß", "ä", "ö", "ü"];

export default function GermanSpecialCharsButtons({ onInsertChar }) {
  return (
    <div className="flex gap-3 mt-4 justify-center">
      {specialChars.map((char) => (
        <button
          key={char}
          onClick={() => onInsertChar(char)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          type="button"
        >
          {char}
        </button>
      ))}
    </div>
  );
}
