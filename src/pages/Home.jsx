import { useEffect } from "react";
import HardWordsCount from "../components/hardWordsCount";
import LessonsCards from "../components/lessonsCards/lessonsCards";
import ReviewWordsOverview from "../components/reviewWordsOverview";

export default function Home() {
  useEffect(() => {
    document.title = "Lexi - الصفحة الرئيسية"; // غيّر الاسم اللي إنت عايزه
  }, []);
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to left bottom, #fffcf3, #fffaeb, #fff8e4, #fff6dc, #fff4d5)",
        minHeight: "calc(100vh - 82px)",
      }}
      className=" container pt-10 px-20"
    >
      <div className=" flex items-center justify-between gap-3">
        <ReviewWordsOverview />
        <HardWordsCount />
      </div>
      <LessonsCards />
    </div>
  );
}
