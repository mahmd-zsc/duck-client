import React from "react";
import { Card, Tag, Space } from "antd";
import { CheckOutlined, CloseOutlined, RightOutlined } from "@ant-design/icons";

const QuizListItem = ({ quiz, isSelected, onClick, onContextMenu }) => {
  return (
    <Card
      className={`mb-3 cursor-pointer transition-all ${
        isSelected ? "border-blue-500 bg-blue-50" : ""
      }`}
      onClick={() => onClick(quiz._id)}
      onContextMenu={(e) => onContextMenu(e, quiz)}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {isSelected && <CheckOutlined className="mt-1 text-blue-500" />}
            <div>
              <h3 className="text-base font-medium mb-1">{quiz.question}</h3>
              <p className="text-gray-600 mb-2">{quiz.meaning}</p>
              <Space size="small">
                <Tag color="geekblue">{quiz.rule}</Tag>
                <Tag>
                  <Space size="small">
                    <span>تمت الإجابة</span>
                    <span>{quiz.timesAnswered || 0}</span>
                  </Space>
                </Tag>
              </Space>
            </div>
          </div>
        </div>

        <div className="mt-2 md:mt-0 md:ml-4">
          <Space>
            {quiz.options.map((option, index) => (
              <Tag
                key={index}
                color={option === quiz.answer ? "green" : "default"}
                className="flex items-center"
              >
                {option === quiz.answer && <RightOutlined className="ml-1" />}
                {option}
              </Tag>
            ))}
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default QuizListItem;
