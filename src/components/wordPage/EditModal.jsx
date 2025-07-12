import React, { useMemo } from "react";
import { X, Save, RotateCcw, Plus, Trash2 } from "lucide-react";

const EditModal = ({
  visible,
  wordData,
  onWordChange,
  onTranslationChange,
  onPronunciationChange,
  onArticleChange,
  onPluralChange,
  onPluralPronunciationChange,
  onIncorrectPluralsChange,
  onTypeChange,
  onConjugationChange,
  onExamplesChange,
  onSave,
  onCancel,
}) => {
  // منع التمرير في الصفحة الخارجية عند فتح المودال
  React.useEffect(() => {
    if (visible) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [visible]);

  const removeExample = (index) => {
    const newExamples = wordData.examples?.filter((_, i) => i !== index) || [];
    onExamplesChange(0, null, null, false, newExamples);
  };

  const handleSave = () => {
    const cleanedData = {
      ...wordData,
      examples: wordData.examples?.map(({ _id, ...rest }) => rest) || [],
    };
    onSave(cleanedData);
  };

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    children,
  }) => (
    <div>
      <label className="block text-sm font-normal text-gray-700 mb-2">
        {label}
      </label>
      {children || (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          placeholder={placeholder}
        />
      )}
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <InputField label={label} value={value} onChange={onChange}>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 border border-gray-300 bg-white text-gray-700 rounded-2xl text-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </InputField>
  );

  if (!visible || !wordData) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={onCancel}
      style={{ touchAction: "none" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-gray-300 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <X
              size={12}
              className="text-gray-500 cursor-pointer"
              onClick={onCancel}
            />
          </div>
          <h1 className="text-base font-normal text-gray-800">تعديل الكلمة</h1>
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center">
            <Save size={12} className="text-gray-500" />
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-10"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="الكلمة الألمانية"
                  value={wordData.word}
                  onChange={onWordChange}
                  placeholder="أدخل الكلمة الألمانية"
                />

                <InputField
                  label="المعنى بالعربي"
                  value={wordData.meaning}
                  onChange={onTranslationChange}
                  placeholder="أدخل المعنى بالعربي"
                />

                <InputField
                  label="النطق بالعربي"
                  value={wordData.pronunciation}
                  onChange={onPronunciationChange}
                  placeholder="أدخل النطق بالعربي"
                />

                <SelectField
                  label="نوع الكلمة"
                  value={wordData.type}
                  onChange={onTypeChange}
                  options={[
                    { value: "", label: "اختر النوع" },
                    { value: "noun", label: "اسم" },
                    { value: "verb", label: "فعل" },
                    { value: "adjective", label: "صفة" },
                    { value: "adverb", label: "حال" },
                    { value: "pronoun", label: "ضمير" },
                    { value: "konjunktion", label: "حرف ربط" },
                  ]}
                />
              </div>
            </div>

            {/* Noun Specific Fields */}
            {wordData.type === "noun" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <SelectField
                    label="أداة التعريف"
                    value={wordData.article}
                    onChange={onArticleChange}
                    options={[
                      { value: "", label: "اختر أداة التعريف" },
                      { value: "der", label: "der" },
                      { value: "die", label: "die" },
                      { value: "das", label: "das" },
                    ]}
                  />

                  <InputField
                    label="صيغة الجمع"
                    value={wordData.plural}
                    onChange={onPluralChange}
                    placeholder="أدخل صيغة الجمع"
                  />

                  <InputField
                    label="نطق الجمع بالعربي"
                    value={wordData.pluralPronunciation}
                    onChange={onPluralPronunciationChange}
                    placeholder="أدخل نطق الجمع بالعربي"
                  />

                  <InputField
                    label="جمع خاطئ (مفصول بفاصلة)"
                    value={wordData.incorrectPlurals?.join(", ")}
                    onChange={(value) =>
                      onIncorrectPluralsChange(
                        value
                          .split(",")
                          .map((item) => item.trim())
                          .filter((item) => item)
                      )
                    }
                    placeholder="أدخل جمع خاطئ (مفصول بفاصلة)"
                  />
                </div>
              </div>
            )}

            {/* Verb Specific Fields */}
            {wordData.type === "verb" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(wordData.conjugation || {}).map(
                    ([key, value]) => (
                      <InputField
                        key={key}
                        label={key}
                        value={value}
                        onChange={(newValue) =>
                          onConjugationChange(key, newValue)
                        }
                        placeholder={`أدخل ${key}`}
                      />
                    )
                  )}
                </div>
              </div>
            )}

            {/* Examples Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-normal text-gray-700">
                  الأمثلة
                </label>
                <button
                  onClick={() =>
                    onExamplesChange(
                      wordData.examples?.length || 0,
                      null,
                      null,
                      true
                    )
                  }
                  className="bg-white border border-gray-300 rounded-2xl py-2 px-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus size={16} />
                  إضافة مثال
                </button>
              </div>

              <div className="space-y-4">
                {wordData.examples?.map((example, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-300 bg-white rounded-2xl space-y-4 relative"
                  >
                    <button
                      onClick={() => removeExample(index)}
                      className="absolute top-2 left-2 p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                      <InputField
                        label="الجملة الألمانية"
                        value={example.sentence}
                        onChange={(value) =>
                          onExamplesChange(index, "sentence", value)
                        }
                        placeholder="أدخل الجملة الألمانية"
                      />

                      <InputField
                        label="المعنى بالعربي"
                        value={example.meaning}
                        onChange={(value) =>
                          onExamplesChange(index, "meaning", value)
                        }
                        placeholder="أدخل المعنى بالعربي"
                      />

                      <InputField
                        label="النطق بالعربي"
                        value={example.pronunciation}
                        onChange={(value) =>
                          onExamplesChange(index, "pronunciation", value)
                        }
                        placeholder="أدخل النطق بالعربي"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white flex-shrink-0">
          <div className="flex gap-4 w-full">
            <button
              onClick={handleSave}
              disabled={!wordData.word?.trim() || !wordData.meaning?.trim()}
              className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Save size={16} />
              حفظ التعديلات
            </button>

            <button
              onClick={onCancel}
              className="flex-1 bg-white border border-gray-300 rounded-2xl py-4 text-gray-700 text-sm font-normal hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
