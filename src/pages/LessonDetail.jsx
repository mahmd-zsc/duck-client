import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ModalAddWord from "../components/lessonDetail/ModalAddWord";
import { getLessonById } from "../redux/slices/lessonSlice";
import { setWordIds, clearWordIds } from "../redux/slices/wordSlice";
import DeleteLessonButton from "../components/lessonDetail/DeleteLessonButton";
import {
  Info,
  Plus,
  Trash2,
  X,
  Eye,
  AlertTriangle,
  Zap,
  BookOpen,
  Edit3,
  Search,
} from "lucide-react";
import { generateShapes, renderShape } from "../utils/backgroundShapes";
import ReviewCard from "../components/wordPage/ReviewCard";
import EditModal from "../components/wordPage/EditModal";
import { deleteWordApi, updateWordApi } from "../redux/apiCalls/wordApi";

function LessonDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");

  // Review Card States
  const [reviewCard, setReviewCard] = useState({
    visible: false,
    wordData: null,
  });

  // Edit Modal States
  const [editModal, setEditModal] = useState({
    visible: false,
    wordData: null,
  });

  useEffect(() => {
    document.title = "Lexi - تفاصيل الدرس";
    dispatch(getLessonById(id));
  }, [id, dispatch]);

  const { selectedLesson, loading, error } = useSelector(
    (state) => state.lesson
  );

  const shapes = useMemo(() => {
    return generateShapes(40);
  }, []);

  // فلترة الكلمات حسب البحث
  const filteredWords = useMemo(() => {
    if (!selectedLesson?.words) return [];
    if (!searchTerm.trim()) return selectedLesson.words;

    return selectedLesson.words.filter((wordObj) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const wordLower = wordObj.word.toLowerCase();
      const meaningLower = wordObj.meaning?.toLowerCase() || "";

      return (
        wordLower.includes(searchLower) || meaningLower.includes(searchLower)
      );
    });
  }, [selectedLesson?.words, searchTerm]);

  const handleWordClick = (wordId) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      newSet.has(wordId) ? newSet.delete(wordId) : newSet.add(wordId);
      return newSet;
    });
  };

  // معالجة الضغط بالزر الأيمن
  const handleContextMenu = (e, wordData) => {
    e.preventDefault();
    e.stopPropagation();

    setReviewCard({
      visible: true,
      wordData,
    });
  };

  // حذف الكلمة من بطاقة المراجعة
  const handleReviewCardDelete = async () => {
    if (!reviewCard.wordData?._id) return;

    try {
      await deleteWordApi(reviewCard.wordData._id);
      // إعادة تحميل الدرس بعد الحذف
      dispatch(getLessonById(id));

      // إزالة الكلمة من التحديد إذا كانت محددة
      setSelectedWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(reviewCard.wordData._id);
        return newSet;
      });

      setReviewCard({ ...reviewCard, visible: false });
    } catch (error) {
      console.error("خطأ في حذف الكلمة:", error);
      alert("حدث خطأ أثناء حذف الكلمة");
    }
  };

  // فتح نافذة التعديل من بطاقة المراجعة
  const handleReviewCardEdit = () => {
    if (!reviewCard.wordData) return;

    setEditModal({
      visible: true,
      wordData: {
        ...reviewCard.wordData,
        incorrectPlurals: reviewCard.wordData.incorrectPlurals || [],
        examples: reviewCard.wordData.examples || [],
        conjugation: reviewCard.wordData.conjugation || {
          infinitive: "",
          present: {
            ich: "",
            du: "",
            er: "",
            sieShe: "",
            es: "",
            wir: "",
            ihr: "",
            sieThey: "",
            Sie: "",
          },
        },
      },
    });

    setReviewCard({ ...reviewCard, visible: false });
  };

  // تعلم الكلمة من بطاقة المراجعة
  const handleReviewCardLearn = () => {
    dispatch(setWordIds([reviewCard.wordData._id]));
    setReviewCard({ visible: false, wordData: null });
    navigate("/questions?mode=learn");
  };

  // مراجعة الكلمة من بطاقة المراجعة
  const handleReviewCardReview = () => {
    dispatch(setWordIds([reviewCard.wordData._id]));
    setReviewCard({ visible: false, wordData: null });
    navigate("/questions?mode=review");
  };

  // إغلاق بطاقة المراجعة
  const closeReviewCard = () => {
    setReviewCard({ visible: false, wordData: null });
  };

  // إغلاق نافذة التعديل
  const closeEditModal = () => {
    setEditModal({
      visible: false,
      wordData: null,
    });
  };

  // تحديث الكلمة
  const handleUpdateWord = async () => {
    if (
      !editModal.wordData ||
      !editModal.wordData.word?.trim() ||
      !editModal.wordData.meaning?.trim()
    )
      return;

    try {
      await updateWordApi(editModal.wordData._id, editModal.wordData);
      // إعادة تحميل الدرس بعد التحديث
      dispatch(getLessonById(id));
      closeEditModal();
    } catch (error) {
      console.error("خطأ في تحديث الكلمة:", error);
      alert("حدث خطأ أثناء تحديث الكلمة");
    }
  };

  const handleCancel = () => {
    setSelectedWords(new Set());
  };

  const handleReview = () => {
    const selectedWordIds = Array.from(selectedWords);
    dispatch(setWordIds(selectedWordIds));
    setSelectedWords(new Set());
    navigate("/questions?mode=review");
  };

  const handleQuickReview = () => {
    const selectedWordIds = Array.from(selectedWords);
    dispatch(setWordIds(selectedWordIds));
    setSelectedWords(new Set());
    navigate("/questions?mode=quick-review");
  };

  const handleLearn = () => {
    const selectedWordIds = Array.from(selectedWords);
    dispatch(setWordIds(selectedWordIds));
    setSelectedWords(new Set());
    navigate("/questions?mode=learn");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSelectedWords(new Set());
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading || !selectedLesson) {
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

  const reviewedWords =
    selectedLesson.words?.filter((word) => word.isReviewed).length || 0;
  const hardWords =
    selectedLesson.words?.filter((word) => word.isHard).length || 0;
  const reviewedPercentage = selectedLesson.reviewedPercentage || 0;

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
          <h1 className="text-base font-normal text-gray-800">
            {selectedLesson.title}
          </h1>
        </div>

        {/* شريط البحث */}
        <div className="relative mb-6">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="ابحث عن كلمة..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* أزرار الإجراءات عند التحديد */}
        {selectedWords.size > 0 && (
          <div className="absolute top-10 left-1/2 -translate-x-1/2 flex justify-center gap-2 mb-6 z-40">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm"
            >
              <X size={14} /> إلغاء ({selectedWords.size})
            </button>
            <button
              onClick={handleQuickReview}
              className="flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg text-white text-sm"
            >
              <Zap size={14} /> مراجعة سريعة
            </button>
            <button
              onClick={handleReview}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm"
            >
              <Eye size={14} /> مراجعة
            </button>
            <button
              onClick={handleLearn}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm"
            >
              <BookOpen size={14} /> تعلم
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col relative z-10">
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="mb-3">
                <span className="text-6xl font-light text-gray-900">
                  {filteredWords.length}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <div>
                  {searchTerm ? "كلمة في نتائج البحث" : "كلمة في هذا الدرس"}
                </div>
                {hardWords > 0 && !searchTerm && (
                  <div className="mt-1 text-orange-600 font-medium">
                    {hardWords} كلمة صعبة
                  </div>
                )}
                {selectedWords.size > 0 && (
                  <div className="mt-1 text-blue-600 font-medium">
                    {selectedWords.size} كلمة محددة
                  </div>
                )}
              </div>
            </div>

            {!searchTerm && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">
                    الكلمات المراجعة
                  </span>
                  <span className="text-xs font-medium text-gray-800">
                    {reviewedPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gray-800 transition-all duration-700"
                    style={{ width: `${reviewedPercentage}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 mb-8">
            {filteredWords.length === 0 && searchTerm ? (
              <div className="text-center py-12">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">
                  لم يتم العثور على نتائج
                </p>
                <p className="text-gray-400 text-sm">جرب البحث بكلمات أخرى</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {filteredWords.map((wordObj) => (
                  <div
                    key={wordObj._id}
                    onClick={() => handleWordClick(wordObj._id)}
                    onContextMenu={(e) => handleContextMenu(e, wordObj)}
                    className={`border rounded-xl p-3 text-center transition-all cursor-pointer select-none relative ${
                      selectedWords.has(wordObj._id)
                        ? "bg-blue-500 border-blue-600 text-white shadow-lg transform scale-105"
                        : wordObj.isHard
                        ? wordObj.isReviewed
                          ? "bg-orange-50 border-orange-300 hover:bg-orange-100"
                          : "bg-red-50 border-red-300 hover:bg-red-100"
                        : wordObj.isReviewed
                        ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {wordObj.isHard && (
                      <div className="absolute -top-1 -right-1">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            selectedWords.has(wordObj._id)
                              ? "bg-white text-orange-500"
                              : wordObj.isReviewed
                              ? "bg-orange-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          <AlertTriangle size={10} />
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-sm font-medium mb-1 ${
                        selectedWords.has(wordObj._id)
                          ? "text-white"
                          : wordObj.isHard
                          ? wordObj.isReviewed
                            ? "text-orange-800"
                            : "text-red-800"
                          : wordObj.isReviewed
                          ? "text-blue-800"
                          : "text-gray-800"
                      }`}
                    >
                      {wordObj.word}
                    </div>
                    {wordObj.translation && (
                      <div
                        className={`text-xs ${
                          selectedWords.has(wordObj._id)
                            ? "text-blue-100"
                            : wordObj.isHard
                            ? wordObj.isReviewed
                              ? "text-orange-600"
                              : "text-red-600"
                            : "text-gray-500"
                        }`}
                      >
                        {wordObj.translation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mt-auto">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              إضافة كلمة جديدة
            </button>
            <DeleteLessonButton
              lessonId={selectedLesson._id}
              className="flex-1 bg-white border border-red-300 rounded-2xl py-4 text-red-600 text-sm font-normal hover:bg-red-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              حذف الدرس
            </DeleteLessonButton>
          </div>
        </div>

        <ModalAddWord
          showModal={showModal}
          lessonId={selectedLesson._id}
          setShowModal={setShowModal}
        />

        {/* Review Card */}
        {reviewCard.visible && (
          <ReviewCard
            wordData={reviewCard.wordData}
            onEdit={handleReviewCardEdit}
            onDelete={handleReviewCardDelete}
            onClose={closeReviewCard}
            onLearn={handleReviewCardLearn}
            onReview={handleReviewCardReview}
          />
        )}

        {/* Edit Modal */}
        <EditModal
          visible={editModal.visible}
          wordData={editModal.wordData}
          onWordChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, word: value },
            }))
          }
          onTranslationChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, meaning: value },
            }))
          }
          onPronunciationChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, pronunciation: value },
            }))
          }
          onArticleChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, article: value },
            }))
          }
          onPluralChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, plural: value },
            }))
          }
          onPluralPronunciationChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, pluralPronunciation: value },
            }))
          }
          onIncorrectPluralsChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, incorrectPlurals: value },
            }))
          }
          onTypeChange={(value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: { ...prev.wordData, type: value },
            }))
          }
          onConjugationChange={(key, value) =>
            setEditModal((prev) => ({
              ...prev,
              wordData: {
                ...prev.wordData,
                conjugation: {
                  ...prev.wordData.conjugation,
                  [key]: value,
                },
              },
            }))
          }
          onExamplesChange={(index, field, value, isNew) => {
            if (isNew) {
              setEditModal((prev) => ({
                ...prev,
                wordData: {
                  ...prev.wordData,
                  examples: [
                    ...(prev.wordData.examples || []),
                    { sentence: "", meaning: "", pronunciation: "" },
                  ],
                },
              }));
            } else {
              const newExamples = [...(editModal.wordData.examples || [])];
              newExamples[index] = { ...newExamples[index], [field]: value };
              setEditModal((prev) => ({
                ...prev,
                wordData: { ...prev.wordData, examples: newExamples },
              }));
            }
          }}
          onSave={handleUpdateWord}
          onCancel={closeEditModal}
        />
      </div>
    </div>
  );
}

export default LessonDetail;
