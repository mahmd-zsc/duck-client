import React from "react";
import { Progress, Row, Col, Statistic, Tooltip } from "antd";
import {
  QuestionCircleOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  StarOutlined,
} from "@ant-design/icons";

const StatisticsSection = ({
  searchTerm,
  filteredQuizzesCount,
  totalQuizzesCount,
  rulesCount,
  selectedQuizzesCount,
  lastUpdated,
}) => {
  const filteredPercentage =
    totalQuizzesCount > 0
      ? Math.round((filteredQuizzesCount / totalQuizzesCount) * 100)
      : 0;

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Statistic
            title={
              <span>
                <QuestionCircleOutlined className="mr-1" />
                إجمالي الأسئلة
              </span>
            }
            value={totalQuizzesCount}
            suffix={`/ ${filteredQuizzesCount}`}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title={
              <span>
                <FilterOutlined className="mr-1" />
                القواعد
              </span>
            }
            value={rulesCount}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Statistic
            title={
              <span>
                <CheckCircleOutlined className="mr-1" />
                الأسئلة المحددة
              </span>
            }
            value={selectedQuizzesCount}
          />
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div className="flex items-center">
            <Progress
              type="circle"
              percent={filteredPercentage}
              width={50}
              format={() => `${filteredPercentage}%`}
              className="mr-2"
            />
            <div>
              <div className="text-sm text-gray-600">
                {searchTerm ? "نتائج البحث" : "كل الأسئلة"}
              </div>
              <div className="text-xs text-gray-500">
                {filteredQuizzesCount} من {totalQuizzesCount}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {lastUpdated && (
        <div className="mt-3 text-xs text-gray-500 text-left">
          آخر تحديث: {new Date(lastUpdated).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default StatisticsSection;
