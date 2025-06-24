import React from "react";
import { Modal, Button, Input, Select, Space } from "antd";

const { TextArea } = Input;
const { Option } = Select;

const EditModal = ({
  visible,
  quizData,
  onQuestionChange,
  onOptionsChange,
  onAnswerChange,
  onMeaningChange,
  onRuleChange,
  onPronunciationChange,
  onSave,
  onCancel,
}) => {
  if (!quizData) return null;

  return (
    <Modal
      title="تعديل السؤال"
      visible={visible}
      onOk={onSave}
      onCancel={onCancel}
      okText="حفظ"
      cancelText="إلغاء"
      width={700}
      centered
      dir="rtl"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            السؤال
          </label>
          <Input
            value={quizData.question}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder="أدخل السؤال"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            النطق (اختياري)
          </label>
          <Input
            value={quizData.pronunciation || ""}
            onChange={(e) => onPronunciationChange(e.target.value)}
            placeholder="أدخل النطق"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الخيارات
          </label>
          <Space direction="vertical" style={{ width: "100%" }} size="small">
            {quizData.options.map((option, index) => (
              <Input
                key={index}
                value={option}
                onChange={(e) => onOptionsChange(index, e.target.value)}
                placeholder={`الخيار ${index + 1}`}
                addonBefore={`${index + 1}`}
              />
            ))}
          </Space>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            الإجابة الصحيحة
          </label>
          <Select
            style={{ width: "100%" }}
            value={quizData.answer}
            onChange={onAnswerChange}
          >
            {quizData.options.map((option, index) => (
              <Option key={index} value={option}>
                {option}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            المعنى
          </label>
          <TextArea
            rows={2}
            value={quizData.meaning}
            onChange={(e) => onMeaningChange(e.target.value)}
            placeholder="أدخل معنى السؤال"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            القاعدة
          </label>
          <Input
            value={quizData.rule}
            onChange={(e) => onRuleChange(e.target.value)}
            placeholder="أدخل القاعدة"
          />
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
