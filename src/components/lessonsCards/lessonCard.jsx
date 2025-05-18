// lessonCard.jsx
import React, { useState } from "react";
import img1 from "../../../images/download-removebg-preview (1).png";
import img3 from "../../../images/download-removebg-preview.png";
import img4 from "../../../images/download__1_-removebg-preview.png";
import img5 from "../../../images/download__2_-removebg-preview (1).png";
import img7 from "../../../images/download__3_-removebg-preview (1).png";
import img8 from "../../../images/download__5_-removebg-preview.png";

function LessonCard({ title, level, wordsNumber, emoji, onClick }) {
  const funImages = [img1, img3, img4, img5, img7, img8];
  const [randomImage] = useState(
    funImages[Math.floor(Math.random() * funImages.length)]
  );
  return (
    <div
      onClick={onClick}
      className="relative rounded-xl p-4 w-full h-[140px] flex flex-col justify-between hover:scale-105 transition-transform duration-300 cursor-pointer bg-white shadow-lg hover:shadow-xl"
    >
      {/* الكلام كلها هنا نعملها relative و z-index عالي */}
      <div className="relative z-20">
        <div className="text-xl font-bold bg-[#FFBB00] w-fit px-1 rounded-full border">
          {wordsNumber}
        </div>
        <div className="text-sm opacity-80 capitalize">{level}</div>
        <div className="text-base font-semibold">{title}</div>
        <div className="flex items-center gap-2 mt-2 text-lg">
          <span>{emoji}</span>
        </div>
      </div>

      {/* الصورة تبقى تحت الكلام بز-index أقل */}
      <div className="funimge absolute right-0 top-0 opacity-70 z-10">
        <img className="h-40" src={randomImage} alt="Fun decoration" />
      </div>
    </div>
  );
}

export default LessonCard;
