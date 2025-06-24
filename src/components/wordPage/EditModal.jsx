import React, { useMemo } from "react";
import { X, Save, RotateCcw, Plus, Trash2 } from "lucide-react";

// Generate background shapes similar to Words page
const generateShapes = (count) => {
  const shapes = [];
  for (let i = 0; i < count; i++) {
    shapes.push({
      id: i,
      type: Math.random() > 0.5 ? "circle" : "square",
      size: Math.random() * 60 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.05 + 0.02,
      color: `hsl(${Math.random() * 360}, 50%, 60%)`,
      rotation: Math.random() * 360,
    });
  }
  return shapes;
};

const renderShape = (shape) => {
  const style = {
    position: "absolute",
    left: `${shape.x}%`,
    top: `${shape.y}%`,
    width: `${shape.size}px`,
    height: `${shape.size}px`,
    opacity: shape.opacity,
    backgroundColor: shape.color,
    transform: `rotate(${shape.rotation}deg)`,
    pointerEvents: "none",
    zIndex: 1,
  };

  if (shape.type === "circle") {
    style.borderRadius = "50%";
  } else {
    style.borderRadius = "8px";
  }

  return <div key={shape.id} style={style} />;
};

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
  const shapes = useMemo(() => generateShapes(30), [visible]);

  // منع التمرير في الصفحة الخارجية عند فتح المودال
  React.useEffect(() => {
    if (visible) {
      // حفظ القيمة الحالية لـ overflow
      const originalOverflow = document.body.style.overflow;
      // منع التمرير
      document.body.style.overflow = "hidden";

      // إرجاع التمرير عند إغلاق المودال
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [visible]);

  if (!visible || !wordData) return null;

  const removeExample = (index) => {
    const newExamples = wordData.examples?.filter((_, i) => i !== index) || [];
    onExamplesChange(0, null, null, false, newExamples);
  };

  const InputField = ({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    children,
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children || (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
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
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </InputField>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir="rtl"
      onClick={onCancel}
      style={{ touchAction: "none" }}
    >
      <div
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {shapes.map(renderShape)}
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/50 flex-shrink-0">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100/50 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">تعديل الكلمة</h2>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Save size={16} className="text-white" />
          </div>
        </div>

        {/* Content */}
        <div
          className="relative z-10 flex-1 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 180px)" }}
        >
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                المعلومات الأساسية
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  معلومات الاسم
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  تصريف الفعل
                </h3>

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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  الأمثلة
                </h3>
                <button
                  onClick={() =>
                    onExamplesChange(
                      wordData.examples?.length || 0,
                      null,
                      null,
                      true
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Plus size={16} />
                  إضافة مثال
                </button>
              </div>

              <div className="space-y-4">
                {wordData.examples?.map((example, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50/50 rounded-xl space-y-4 relative"
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
        <div className="relative z-10 p-6 border-t border-gray-200/50 bg-white/50 flex-shrink-0">
          <div className="flex gap-4 w-full">
            <button
              onClick={onSave}
              disabled={!wordData.word?.trim() || !wordData.meaning?.trim()}
              className="flex-1 min-h-[50px] bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-lg"
            >
              <Save size={18} />
              حفظ التعديلات
            </button>

            <button
              onClick={onCancel}
              className="flex-1 min-h-[50px] bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
            >
              <RotateCcw size={18} />
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
