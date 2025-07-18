import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllWordsApi,
  deleteWordApi,
  updateWordApi,
  markWordsAsImportantApi,
  markWordsAsUnimportantApi,
} from "../redux/apiCalls/wordApi";
import {
  setWordIds,
  clearWordIds,
  setAllWords,
} from "../redux/slices/wordSlice";
import { generateShapes, renderShape } from "../utils/backgroundShapes";
import { Info, Search } from "lucide-react"; // أضف Search هنا// Import Components
import ActionButtons from "../components/wordPage/ActionButtons";
import ReviewCard from "../components/wordPage/ReviewCard";
import EditModal from "../components/wordPage/EditModal";
import SearchAndControls from "../components/wordPage/SearchAndControls";
import StatisticsSection from "../components/wordPage/StatisticsSection";
import WordCard from "../components/wordPage/WordCard";
import WordListItem from "../components/wordPage/WordListItem";

const Words = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const words = useSelector((state) => state.word.allWords);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [hasImportantSelected, setHasImportantSelected] = useState(false);

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
    document.title = "Lexi - قائمة الكلمات";

    const fetchWords = async () => {
      try {
        const res = await getAllWordsApi();
        dispatch(setAllWords(res));
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل الكلمات");
      } finally {
        setLoading(false);
      }
    };
    if (words.length < 1) {
      fetchWords();
    }
  }, [dispatch]);

  const shapes = useMemo(() => {
    return generateShapes(0);
  }, []);

  useEffect(() => {
    const selected = Array.from(selectedWords);
    const wordsSelected = words.filter((word) => selected.includes(word._id));
    setHasImportantSelected(wordsSelected.some((word) => word.isImportant));
  }, [selectedWords, words]);

  const handleMarkImportant = async () => {
    try {
      await markWordsAsImportantApi(Array.from(selectedWords));
      // تحديث الحالة المحلية
      const updatedWords = words.map((word) =>
        selectedWords.has(word._id) ? { ...word, isImportant: true } : word
      );
      dispatch(setAllWords(updatedWords));
    } catch (error) {
      console.error("Error marking as important:", error);
      alert("حدث خطأ أثناء تحديد الكلمات كمهمة");
    }
  };

  const handleMarkUnimportant = async () => {
    try {
      await markWordsAsUnimportantApi(Array.from(selectedWords));
      // تحديث الحالة المحلية
      const updatedWords = words.map((word) =>
        selectedWords.has(word._id) ? { ...word, isImportant: false } : word
      );
      dispatch(setAllWords(updatedWords));
    } catch (error) {
      console.error("Error marking as unimportant:", error);
      alert("حدث خطأ أثناء إزالة علامة الأهمية");
    }
  };

  // فلترة الكلمات حسب البحث
  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) return words;

    return words.filter((wordObj) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const wordLower = wordObj.word.toLowerCase();
      const meaningLower = wordObj.meaning?.toLowerCase() || "";

      return (
        wordLower.includes(searchLower) || meaningLower.includes(searchLower)
      );
    });
  }, [words, searchTerm]);

  const handleWordClick = useCallback((wordId) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      newSet.has(wordId) ? newSet.delete(wordId) : newSet.add(wordId);
      return newSet;
    });
  }, []);

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

      // تحديث القائمة محلياً
      const updatedWords = words.filter(
        (word) => word._id !== reviewCard.wordData._id
      );
      dispatch(setAllWords(updatedWords));

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

      // تحديث القائمة محلياً
      const updatedWords = words.map((word) =>
        word._id === editModal.wordData._id
          ? { ...word, ...editModal.wordData }
          : word
      );
      dispatch(setAllWords(updatedWords));

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

  const reviewedWords = words.filter((word) => word.isReviewed).length;
  const hardWords = words.filter((word) => word.isHard).length;
  const reviewedPercentage =
    words.length > 0 ? Math.round((reviewedWords / words.length) * 100) : 0;

  // Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {filteredWords.map((wordObj) => (
        <WordCard
          key={wordObj._id}
          wordObj={wordObj}
          isSelected={selectedWords.has(wordObj._id)}
          onClick={handleWordClick}
          onContextMenu={handleContextMenu}
        />
      ))}
    </div>
  );

  return (
    <div
      // style={{
      //   backgroundImage:
      //     "linear-gradient(to left bottom, #fffcf3, #fffaeb, #fff8e4, #fff6dc, #fff4d5)",
      //   minHeight: "calc(100vh - 82px)",
      // }}
      className="relative flex flex-1 h-full p-4 "
      dir="rtl"
    >
      <div className="flex-1 flex flex-col w-full p-8 py-10 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {shapes.map(renderShape)}
        </div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Info size={12} className="text-gray-500" />
          </div>
          <h1 className="text-base font-normal text-gray-800">قائمة الكلمات</h1>
        </div>

        {/* شريط البحث وأزرار التحكم */}
        <SearchAndControls
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          filteredWordsCount={filteredWords.length}
          totalWordsCount={words.length}
        />

        {/* أزرار الإجراءات عند التحديد */}
        {selectedWords.size > 0 && (
          <ActionButtons
            selectedCount={selectedWords.size}
            onCancel={handleCancel}
            onQuickReview={handleQuickReview}
            onReview={handleReview}
            onLearn={handleLearn}
            onMarkImportant={handleMarkImportant}
            onMarkUnimportant={handleMarkUnimportant}
            hasImportantSelected={hasImportantSelected}
          />
        )}

        <div className="flex flex-1 flex-col relative z-10">
          <StatisticsSection
            searchTerm={searchTerm}
            filteredWordsCount={filteredWords.length}
            totalWordsCount={words.length}
            hardWordsCount={hardWords}
            selectedWordsCount={selectedWords.size}
            reviewedPercentage={reviewedPercentage}
          />

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
              <>{viewMode === "grid" ? <GridView /> : <ListView />}</>
            )}
          </div>
        </div>
      </div>

      {/* Review Card */}
      {reviewCard.visible && (
        <ReviewCard
          wordData={reviewCard.wordData}
          onEdit={handleReviewCardEdit}
          onDelete={handleReviewCardDelete}
          onClose={closeReviewCard}
          onLearn={handleReviewCardLearn}
          onReview={handleReviewCardReview}
          onMarkImportant={async () => {
            try {
              await markWordsAsImportantApi([reviewCard.wordData._id]);
              // تحديث الحالة المحلية
              const updatedWords = words.map((word) =>
                word._id === reviewCard.wordData._id
                  ? { ...word, isImportant: true }
                  : word
              );
              dispatch(setAllWords(updatedWords));
              setReviewCard((prev) => ({
                ...prev,
                wordData: { ...prev.wordData, isImportant: true },
              }));
            } catch (error) {
              console.error("Error marking as important:", error);
              alert("حدث خطأ أثناء تحديد الكلمة كمهمة");
            }
          }}
          onMarkUnimportant={async () => {
            try {
              await markWordsAsUnimportantApi([reviewCard.wordData._id]);
              // تحديث الحالة المحلية
              const updatedWords = words.map((word) =>
                word._id === reviewCard.wordData._id
                  ? { ...word, isImportant: false }
                  : word
              );
              dispatch(setAllWords(updatedWords));
              setReviewCard((prev) => ({
                ...prev,
                wordData: { ...prev.wordData, isImportant: false },
              }));
            } catch (error) {
              console.error("Error marking as unimportant:", error);
              alert("حدث خطأ أثناء إزالة علامة الأهمية");
            }
          }}
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
  );
};

export default Words;
