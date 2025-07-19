// components/wordPage/ReviewCard.jsx
import React, { useState, useEffect } from "react";
import { X, Edit3, Trash2, BookOpen, RotateCcw } from "lucide-react";
import { Star, StarOff, Volume2 } from "lucide-react";

const ReviewCard = ({
  wordData,
  onEdit,
  onDelete,
  onClose,
  onMarkImportant,
  onMarkUnimportant,
}) => {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    // حفظ القيمة الحالية لـ overflow
    const originalOverflow = document.body.style.overflow;
    // منع التمرير
    document.body.style.overflow = "hidden";

    // إرجاع التمرير عند إغلاق المودال
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // تحميل الأصوات المتاحة
  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    // تنظيف الصوت عند إغلاق الكومبوننت
    return () => {
      synth.cancel();
    };
  }, []);

  // دالة تشغيل الصوت
  const handleSpeak = (text, lang = "de-DE") => {
    if (!("speechSynthesis" in window) || !text?.trim()) return;

    const synth = window.speechSynthesis;

    // إيقاف أي صوت حالي
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    // البحث عن صوت ألماني للكلمات الألمانية
    if (lang === "de-DE") {
      const germanVoice = voices.find((voice) => voice.lang.startsWith("de"));
      if (germanVoice) {
        utterance.voice = germanVoice;
      }
    }

    utterance.rate = 0.9; // سرعة أبطأ قليلاً للوضوح
    utterance.pitch = 1;

    synth.speak(utterance);
  };

  // مكون زر الصوت
  const AudioButton = ({ text, lang = "de-DE", size = 16, className = "" }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleSpeak(text, lang);
      }}
      className={`p-1 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
      title="تشغيل الصوت"
    >
      <Volume2 size={size} className="text-gray-500" />
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={onClose}
      style={{ touchAction: "none" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden border border-gray-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <X
              size={12}
              className="text-gray-500 cursor-pointer"
              onClick={onClose}
            />
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-base font-normal text-gray-800">
              {wordData.word}
            </h1>
            <AudioButton text={wordData.word} size={14} />
          </div>
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <BookOpen size={12} className="text-gray-500" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  المعنى
                </label>
                <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                  <span>{wordData.meaning}</span>
                </div>
              </div>

              {wordData.pronunciation && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    النطق
                  </label>
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    <span>{wordData.pronunciation}</span>
                  </div>
                </div>
              )}

              {wordData.type === "noun" && wordData.article && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    أداة التعريف
                  </label>
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    <span>{wordData.article}</span>
                  </div>
                </div>
              )}

              {wordData.type === "noun" && wordData.plural && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    الجمع
                  </label>
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm flex items-center justify-between">
                    <span>{wordData.plural}</span>
                    <AudioButton text={wordData.plural} size={14} />
                  </div>
                </div>
              )}

              {wordData.pluralPronunciation && (
                <div>
                  <label className="block text-sm font-normal text-gray-700 mb-2">
                    نطق الجمع
                  </label>
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    <span>{wordData.pluralPronunciation}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Examples Section */}
            {wordData.examples?.length > 0 && (
              <div className="space-y-4">
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  الأمثلة
                </label>

                <div className="space-y-3">
                  {wordData.examples.map((example, index) => (
                    <div key={index} className="space-y-2">
                      <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium flex-1" dir="ltr">
                            {example.sentence}
                          </p>
                          <AudioButton text={example.sentence} size={14} />
                        </div>

                        {example.meaning && (
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-gray-600 flex-1">
                              {example.meaning}
                            </p>
                          </div>
                        )}

                        {example.pronunciation && (
                          <div className="flex items-center justify-between">
                            <p className="text-gray-500 text-xs flex-1">
                              {example.pronunciation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conjugation for verbs */}
            {wordData.type === "verb" && wordData.conjugation && (
              <div className="space-y-4">
                <label className="block text-sm font-normal text-gray-700 mb-2">
                  التصريف
                </label>

                {wordData.conjugation.infinitive && (
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">المصدر:</span>
                    </div>
                    <p className="font-medium" dir="ltr">
                      {wordData.conjugation.infinitive}
                    </p>
                  </div>
                )}

                {wordData.conjugation.present && (
                  <div className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm">
                    <p className="text-gray-600 mb-3">المضارع:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(wordData.conjugation.present).map(
                        ([key, value]) =>
                          value && (
                            <div
                              key={key}
                              className="flex items-center justify-between"
                            >
                              <span className="text-gray-600 text-xs">
                                {key}:
                              </span>
                              <span
                                className="font-medium flex-1 mx-2"
                                dir="ltr"
                              >
                                {value}
                              </span>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex gap-4 w-full">
              <button
                onClick={
                  wordData.isImportant ? onMarkUnimportant : onMarkImportant
                }
                className="flex-1 bg-white border border-gray-300 rounded-2xl py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {wordData.isImportant ? (
                  <>
                    <StarOff size={16} />
                    إزالة الأهمية
                  </>
                ) : (
                  <>
                    <Star size={16} />
                    تحديد كمهمة
                  </>
                )}
              </button>

              <button
                onClick={onEdit}
                className="flex-1 bg-white border border-gray-300 rounded-2xl py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Edit3 size={16} />
                تعديل
              </button>

              <button
                onClick={onDelete}
                className="flex-1 bg-white border border-gray-300 rounded-2xl py-3 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
