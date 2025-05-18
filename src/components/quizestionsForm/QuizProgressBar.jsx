
export default function QuizProgressBar({ percentage }) {
  return (
    <div
      className="bg-gray-200 rounded-full h-3 mb-6 overflow-hidden mt-4"
      dir="rtl"
    >
      <div
        className="h-full rounded-full bg-[#FFBB00] transition-all duration-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
