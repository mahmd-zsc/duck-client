import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info, X, Eye, AlertTriangle, Zap, BookOpen, Search, Grid3X3, List, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAllWordsApi } from "../redux/apiCalls/wordApi";
import {
  setWordIds,
  clearWordIds,
  setAllWords,
} from "../redux/slices/wordSlice";
import { generateShapes, renderShape } from "../utils/backgroundShapes";

const Words = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const words = useSelector((state) => state.word.allWords);
  const [selectedWords, setSelectedWords] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  useEffect(() => {
    document.title = "Lexi - قائمة الكلمات";

    const fetchWords = async () => {
      try {
        const res = await getAllWordsApi();
        dispatch(setAllWords(res)); // ✅ حسب شكل البيانات الراجعة
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
    return generateShapes(60); // يمكنك تغيير العدد هنا
  }, []);

  // فلترة الكلمات حسب البحث
  const filteredWords = useMemo(() => {
    if (!searchTerm.trim()) return words;
    
    return words.filter((wordObj) => {
      const searchLower = searchTerm.toLowerCase().trim();
      const wordLower = wordObj.word.toLowerCase();
      const translationLower = wordObj.translation?.toLowerCase() || "";
      
      return wordLower.includes(searchLower) || translationLower.includes(searchLower);
    });
  }, [words, searchTerm]);

  const handleWordClick = (wordId) => {
    setSelectedWords((prev) => {
      const newSet = new Set(prev);
      newSet.has(wordId) ? newSet.delete(wordId) : newSet.add(wordId);
      return newSet;
    });
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

  const handleClearStore = () => {
    dispatch(clearWordIds());
    console.log("تم مسح wordIds من الـ store");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // إلغاء التحديد عند البحث لتجنب الالتباس
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
        <div
          key={wordObj._id}
          onClick={() => handleWordClick(wordObj._id)}
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
  );

  // List View Component
  const ListView = () => (
    <div className="space-y-3">
      {filteredWords.map((wordObj) => (
        <div
          key={wordObj._id}
          onClick={() => handleWordClick(wordObj._id)}
          className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer select-none relative ${
            selectedWords.has(wordObj._id)
              ? "bg-gradient-to-r from-blue-500 to-blue-600 border-blue-600 text-white shadow-lg transform scale-[1.02]"
              : wordObj.isHard
              ? wordObj.isReviewed
                ? "bg-white border-orange-200 hover:border-orange-300 hover:shadow-md"
                : "bg-white border-red-200 hover:border-red-300 hover:shadow-md"
              : wordObj.isReviewed
              ? "bg-white border-blue-200 hover:border-blue-300 hover:shadow-md"
              : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center gap-4">
            {/* Selection Checkbox */}
            <div className="flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                  selectedWords.has(wordObj._id)
                    ? "bg-white border-white"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                {selectedWords.has(wordObj._id) && (
                  <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                )}
              </div>
            </div>

            {/* Word Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div
                    className={`text-xl font-semibold ${
                      selectedWords.has(wordObj._id)
                        ? "text-white"
                        : wordObj.isHard
                        ? wordObj.isReviewed
                          ? "text-orange-700"
                          : "text-red-700"
                        : wordObj.isReviewed
                        ? "text-blue-700"
                        : "text-gray-800"
                    }`}
                  >
                    {wordObj.word}
                  </div>
                  
                  {wordObj.translation && (
                    <div
                      className={`text-base ${
                        selectedWords.has(wordObj._id)
                          ? "text-blue-100"
                          : wordObj.isHard
                          ? wordObj.isReviewed
                            ? "text-orange-600"
                            : "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {wordObj.translation}
                    </div>
                  )}
                </div>

                {/* Status Indicators */}
                <div className="flex items-center gap-3">
                  {wordObj.isReviewed && (
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedWords.has(wordObj._id)
                          ? "bg-white/20 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      مراجعة
                    </span>
                  )}
                  
                  {wordObj.isHard && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedWords.has(wordObj._id)
                            ? "bg-white/20 text-white"
                            : wordObj.isReviewed
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        صعبة
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedWords.has(wordObj._id)
                            ? "bg-white/20 text-white"
                            : wordObj.isReviewed
                            ? "bg-orange-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        <AlertTriangle size={12} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Selection Overlay */}
          {selectedWords.has(wordObj._id) && (
            <div className="absolute inset-0 bg-blue-500/10 rounded-xl pointer-events-none"></div>
          )}
        </div>
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
          <h1 className="text-base font-normal text-gray-800">قائمة الكلمات</h1>
        </div>

        {/* شريط البحث وأزرار التحكم */}
        <div className="mb-6 relative z-10 space-y-4">
          {/* شريط البحث */}
          <div className="relative">
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

          {/* أزرار التحكم في العرض */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleViewMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Grid3X3 size={14} />
                شبكة
              </button>
              <button
                onClick={toggleViewMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <List size={14} />
                قائمة
              </button>
            </div>

            {searchTerm && (
              <div className="text-xs text-gray-500">
                {filteredWords.length === 0 
                  ? "لم يتم العثور على كلمات مطابقة" 
                  : `${filteredWords.length} كلمة من أصل ${words.length}`
                }
              </div>
            )}
          </div>
        </div>

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
                  {searchTerm ? filteredWords.length : words.length}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                <div>
                  {searchTerm ? "كلمة في نتائج البحث" : "كلمة في المجموع"}
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
                  <span className="text-xs text-gray-500">الكلمات المراجعة</span>
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
                <p className="text-gray-500 text-lg mb-2">لم يتم العثور على نتائج</p>
                <p className="text-gray-400 text-sm">جرب البحث بكلمات أخرى</p>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? <GridView /> : <ListView />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Words;