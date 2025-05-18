// src/components/quizestionsForm/QuizHeader.jsx
import { IoCloseOutline } from "react-icons/io5";
import { clearQuizzes } from "../../redux/slices/quizSlice";
import { useNavigate } from "react-router-dom";

export default function QuizHeader({ title }) {
  let navigate = useNavigate();
  let handleCloseQizessPage = () => {
    const confirmed = window.confirm("هل أنت متأكد إنك عايز تخرج من الدرس؟ 🤔");
    if (confirmed) {
      clearQuizzes();
      navigate("/");
    }
  };

  return (
    <div className="quizHeader flex justify-between items-center bg-[#5DE7C0] px-32 py-4 border-b">
      <h3 className="text-2xl text-gray-800 font-bold">{title}</h3>
      <IoCloseOutline
        onClick={handleCloseQizessPage}
        size={45}
        color="#1E2939"
        className="font-bold opacity-55 cursor-pointer"
      />
    </div>
  );
}
