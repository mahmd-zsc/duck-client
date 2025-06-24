import React, { useEffect, useState, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchQuizzes,
  fetchRules,
  removeQuiz,
  selectQuiz,
  clearSelectedQuizzes,
} from "../redux/slices/quizSlice";
import { generateShapes, renderShape } from "../utils/backgroundShapes";
import { Info } from "lucide-react";

// استيراد المكونات
import ActionButtons from "../components/quizPage/ActionButtons";
import ContextMenu from "../components/quizPage/ContextMenu";
import EditModal from "../components/quizPage/EditModal";
import SearchAndControls from "../components/quizPage/SearchAndControls";
import StatisticsSection from "../components/quizPage/StatisticsSection";
import QuizCard from "../components/quizPage/QuizCard";
import QuizListItem from "../components/quizPage/QuizListItem";

const Quizzes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { quizzes, rules, loading, error, selectedQuizzes } = useSelector(
    (state) => state.quizzes
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    quizId: null,
    quizData: null,
  });
  const [editModal, setEditModal] = useState({
    visible: false,
    quizData: null,
  });

  const contextMenuRef = useRef(null);

  useEffect(() => {
    document.title = "Lexi - قائمة الأسئلة";
    dispatch(fetchQuizzes());
    dispatch(fetchRules());
  }, [dispatch]);

  // إغلاق قائمة السياق عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu({
          visible: false,
          x: 0,
          y: 0,
          quizId: null,
          quizData: null,
        });
      }
    };

    const handleScroll = () => {
      setContextMenu({
        visible: false,
        x: 0,
        y: 0,
        quizId: null,
        quizData: null,
      });
    };

    if (contextMenu.visible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [contextMenu.visible]);

  const shapes = useMemo(() => {
    return generateShapes(60);
  }, []);

  // فلترة الأسئلة حسب البحث
  const filteredQuizzes = useMemo(() => {
    if (!searchTerm.trim()) return quizzes;

    return quizzes.filter((quiz) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const questionLower = quiz.question.toLowerCase();
      const ruleLower = quiz.rule?.toLowerCase() || "";
      const meaningLower = quiz.meaning?.toLowerCase() || "";

      return (
        questionLower.includes(searchLower) ||
        ruleLower.includes(searchLower) ||
        meaningLower.includes(searchLower)
      );
    });
  }, [quizzes, searchTerm]);

  const handleQuizClick = (quizId) => {
    dispatch(selectQuiz(quizId));
  };

  // معالجة الضغط بالزر الأيمن
  const handleContextMenu = (e, quizData) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    setContextMenu({
      visible: true,
      x,
      y,
      quizId: quizData._id,
      quizData,
    });
  };

  // حذف السؤال
  const handleDeleteQuiz = async () => {
    if (!contextMenu.quizId) return;

    try {
      await dispatch(removeQuiz(contextMenu.quizId)).unwrap();
      setContextMenu({ ...contextMenu, visible: false });
    } catch (error) {
      console.error("خطأ في حذف السؤال:", error);
    }
  };

  // فتح نافذة التعديل
  const handleEditQuiz = () => {
    if (!contextMenu.quizData) return;

    setEditModal({
      visible: true,
      quizData: contextMenu.quizData,
    });

    setContextMenu({ ...contextMenu, visible: false });
  };

  // إغلاق نافذة التعديل
  const closeEditModal = () => {
    setEditModal({
      visible: false,
      quizData: null,
    });
  };

  // تحديث السؤال
  const handleUpdateQuiz = async () => {
    if (!editModal.quizData) return;

    try {
      await dispatch(
        updateQuiz({
          id: editModal.quizData._id,
          quizData: editModal.quizData,
        })
      ).unwrap();
      closeEditModal();
    } catch (error) {
      console.error("خطأ في تحديث السؤال:", error);
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedQuizzes());
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    dispatch(clearSelectedQuizzes());
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">جاري التحميل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {filteredQuizzes.map((quiz) => (
        <QuizCard
          key={quiz._id}
          quiz={quiz}
          isSelected={selectedQuizzes.includes(quiz._id)}
          onClick={handleQuizClick}
          onContextMenu={handleContextMenu}
        />
      ))}
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="space-y-3">
      {filteredQuizzes.map((quiz) => (
        <QuizListItem
          key={quiz._id}
          quiz={quiz}
          isSelected={selectedQuizzes.includes(quiz._id)}
          onClick={handleQuizClick}
          onContextMenu={handleContextMenu}
        />
      ))}
    </div>
  );

  return (
    <div className="relative flex flex-1 h-full p-4" dir="rtl">
      <div className="flex-1 flex flex-col w-full p-8 py-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {shapes.map(renderShape)}
        </div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">قائمة الأسئلة</h1>
        </div>

        {/* شريط البحث وأزرار التحكم */}
        <SearchAndControls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          viewMode={viewMode}
          onToggleViewMode={toggleViewMode}
          filteredQuizzesCount={filteredQuizzes.length}
          totalQuizzesCount={quizzes.length}
        />

        {/* أزرار الإجراءات عند التحديد */}
        {selectedQuizzes.length > 0 && (
          <ActionButtons
            selectedCount={selectedQuizzes.length}
            onCancel={handleCancel}
          />
        )}

        <div className="flex flex-1 flex-col relative z-10">
          <StatisticsSection
            searchTerm={searchTerm}
            filteredQuizzesCount={filteredQuizzes.length}
            totalQuizzesCount={quizzes.length}
            rulesCount={rules.length}
            selectedQuizzesCount={selectedQuizzes.length}
          />

          <div className="flex-1 mb-8">
            {filteredQuizzes.length === 0 && searchTerm ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  لم يتم العثور على نتائج
                </p>
                <p className="text-gray-400 text-sm">جرب البحث بكلمات أخرى</p>
              </div>
            ) : (
              <>{viewMode === "grid" ? <GridView /> : <ListView />}</>
            )}
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <ContextMenu
        ref={contextMenuRef}
        visible={contextMenu.visible}
        x={contextMenu.x}
        y={contextMenu.y}
        onEdit={handleEditQuiz}
        onDelete={handleDeleteQuiz}
        onClose={() => setContextMenu({ ...contextMenu, visible: false })}
      />

      {/* Edit Modal */}
      <EditModal
        visible={editModal.visible}
        quizData={editModal.quizData}
        onQuestionChange={(value) =>
          setEditModal((prev) => ({
            ...prev,
            quizData: { ...prev.quizData, question: value },
          }))
        }
        onOptionsChange={(index, value) => {
          const newOptions = [...editModal.quizData.options];
          newOptions[index] = value;
          setEditModal((prev) => ({
            ...prev,
            quizData: { ...prev.quizData, options: newOptions },
          }));
        }}
        onAnswerChange={(value) =>
          setEditModal((prev) => ({
            ...prev,
            quizData: { ...prev.quizData, answer: value },
          }))
        }
        onMeaningChange={(value) =>
          setEditModal((prev) => ({
            ...prev,
            quizData: { ...prev.quizData, meaning: value },
          }))
        }
        onRuleChange={(value) =>
          setEditModal((prev) => ({
            ...prev,
            quizData: { ...prev.quizData, rule: value },
          }))
        }
        onPronunciationChange={(value) =>
          setEditModal((prev) => ({
            ...prev,
            quizData: { ...prev.quizData, pronunciation: value },
          }))
        }
        onSave={handleUpdateQuiz}
        onCancel={closeEditModal}
      />
    </div>
  );
};

export default Quizzes;
