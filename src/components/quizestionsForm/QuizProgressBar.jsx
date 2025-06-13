export default function QuizProgressBar({ percentage }) {
  return (
    <div
      className="bg-gray-200 rounded-full h-3 mb-6 overflow-hidden mt-4"
      dir="rtl"
    >
      <div
        style={{
          backgroundImage:
            "linear-gradient(to right top, #ffcf4a, #ffca3d, #ffc530, #ffc01e, #ffbb00)",
          width: `${percentage}%`,
        }}
        className="h-full rounded-full bg-[#FFBB00] transition-all duration-500"
      ></div>
    </div>
  );
}
