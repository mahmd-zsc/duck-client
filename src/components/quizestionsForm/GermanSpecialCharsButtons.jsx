import React, { useEffect } from "react";

const specialChars = [ "ä", "ö", "ü","ß"];

export default function GermanSpecialCharsButtons({ onInsertChar }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const index = parseInt(e.key, 10) - 1;
      if (index >= 0 && index < specialChars.length) {
        e.preventDefault(); // 👈 ده بيمنع الرقم من إنه يكتب في الـ input
        onInsertChar(specialChars[index]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onInsertChar]);

  return (
    <div dir="ltr" className="flex gap-3 mt-4 justify-center">
   {specialChars.map((char, index) => (
  <button
    key={char}
    onClick={() => onInsertChar(char)}
    className="group relative px-4 py-2  text-gray-500 rounded-md hover:scale-105  transition shadow border border-gray-200"
    type="button"
    
  >
    {char}
    <span className="absolute -top-2 -right-2 bg-white text-blue-700 text-xs px-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity">
      {index + 1}
    </span>
  </button>
))}

    </div>
  );
}
