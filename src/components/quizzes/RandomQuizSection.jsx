import React, { useState } from "react";
import {
  Card,
  Button,
  InputNumber,
  Select,
  Typography,
  Space,
  Modal,
} from "antd";
import {
  PlayCircleOutlined,
  QuestionCircleOutlined,
  FilterOutlined,
  RetweetOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const RandomQuizSection = ({
  totalQuizzesCount,
  rules = [],
  onStartRandomQuiz,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedRule, setSelectedRule] = useState(null);
  const [difficulty, setDifficulty] = useState("all");

  const handleStartQuiz = () => {
    onStartRandomQuiz({
      count: questionCount,
      rule: selectedRule,
      difficulty: difficulty,
    });
    setIsModalVisible(false);
  };

  const showQuizModal = () => {
    setIsModalVisible(true);
  };

  return (
    <>
      <Card
        className="mb-6 bg-gradient-to-br rounded-3xl from-gray-50 to-orange-50 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer "
        onClick={showQuizModal}
        bodyStyle={{ padding: "40px" }}
      >
        <div className="text-center ">
          {/* العداد في الأعلى */}
          <div className="flex justify-end mb-4 ">
            <div className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-gray-400 border border-gray-200">
              <QuestionCircleOutlined className="text-sm" />
            </div>
          </div>

          {/* العنوان والرقم */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {totalQuizzesCount}
            </div>
            <Text className="text-gray-600 text-base">
              من الأسئلة والتمارين
            </Text>
          </div>

          {/* الأزرار */}
          <div className="flex gap-3 justify-center">
            <Button
              type="default"
              size="large"
              icon={<PlayCircleOutlined color="yellow" />}
              className="px-8 py-2 h-12  border-gray-200 text-gray-700  rounded-full flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                showQuizModal();
              }}
            >
              حل أسئلة
            </Button>
          </div>

          {/* العنوان الرئيسي */}
          <div className="mt-8">
            <Title level={3} className="text-gray-800 mb-0 font-medium">
              أسئلة الترجمة
            </Title>
          </div>
        </div>
      </Card>

      {/* المودال للإعدادات */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <RetweetOutlined />
            <span>إعدادات الكويز</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleStartQuiz}
        onCancel={() => setIsModalVisible(false)}
        okText="ابدأ الكويز"
        cancelText="إلغاء"
        width={500}
        centered
        okButtonProps={{
          size: "large",
          icon: <PlayCircleOutlined />,
          disabled: totalQuizzesCount === 0,
        }}
        cancelButtonProps={{ size: "large" }}
      >
        <div className="space-y-6 py-4">
          {/* عدد الأسئلة */}
          <div>
            <Text strong className="block mb-2 text-gray-700">
              عدد الأسئلة
            </Text>
            <InputNumber
              min={1}
              max={Math.min(totalQuizzesCount, 50)}
              value={questionCount}
              onChange={setQuestionCount}
              className="w-full"
              size="large"
              placeholder="اختر عدد الأسئلة"
            />
            <Text type="secondary" className="text-sm mt-1 block">
              الحد الأقصى: {Math.min(totalQuizzesCount, 50)} سؤال
            </Text>
          </div>

          {/* تصفية حسب القاعدة */}
          <div>
            <Text strong className="block mb-2 text-gray-700">
              القاعدة (اختياري)
            </Text>
            <Select
              placeholder="اختر قاعدة محددة أو اتركها فارغة لكل القواعد"
              allowClear
              value={selectedRule}
              onChange={setSelectedRule}
              className="w-full"
              size="large"
              suffixIcon={<FilterOutlined />}
            >
              {rules.map((rule) => (
                <Option key={rule.rule} value={rule.rule}>
                  {rule.rule} ({rule.count} سؤال)
                </Option>
              ))}
            </Select>
          </div>

          {/* مستوى الصعوبة */}
          <div>
            <Text strong className="block mb-2 text-gray-700">
              مستوى الصعوبة
            </Text>
            <Select
              value={difficulty}
              onChange={setDifficulty}
              className="w-full"
              size="large"
            >
              <Option value="all">كل المستويات</Option>
              <Option value="easy">سهل</Option>
              <Option value="medium">متوسط</Option>
              <Option value="hard">صعب</Option>
            </Select>
          </div>

          {/* معلومات إضافية */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <Space direction="vertical" size="small">
              <Text strong className="text-orange-800">
                📊 إجمالي الأسئلة المتاحة: {totalQuizzesCount}
              </Text>
              <Text className="text-orange-600">
                💡 ستظهر الأسئلة بترتيب عشوائي
              </Text>
              <Text className="text-orange-600">
                ⏱️ لا يوجد حد زمني للإجابة
              </Text>
            </Space>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RandomQuizSection;
