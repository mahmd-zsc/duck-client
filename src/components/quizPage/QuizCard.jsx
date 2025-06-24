import React from "react";
import { Card, Tag, Space } from "antd";
import { CheckOutlined, RightOutlined } from "@ant-design/icons";

const QuizCard = ({ quiz, isSelected, onClick, onContextMenu }) => {
  return (
    <Card
      className={`h-full cursor-pointer transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : ""
      }`}
      onClick={() => onClick(quiz._id)}
      onContextMenu={(e) => onContextMenu(e, quiz)}
    >
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckOutlined className="text-blue-500 text-lg" />
        </div>
      )}

      <div className="flex flex-col h-full">
        <h3 className="text-base font-medium mb-2 line-clamp-2">
          {quiz.question}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {quiz.meaning}
        </p>

        <div className="mt-auto">
          <Tag color="geekblue" className="mb-2">
            {quiz.rule}
          </Tag>

          <div className="space-y-2">
            {quiz.options.map((option, index) => (
              <div
                key={index}
                className={`p-2 rounded border ${
                  option === quiz.answer
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <Space>
                  {option === quiz.answer && (
                    <RightOutlined className="text-green-500" />
                  )}
                  <span>{option}</span>
                </Space>
              </div>
            ))}
          </div>

          <div className="mt-2 text-xs text-gray-500">
            تمت الإجابة: {quiz.timesAnswered || 0} مرات
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QuizCard;
