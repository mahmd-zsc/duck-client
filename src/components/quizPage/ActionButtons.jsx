import React from "react";
import { Button, Space } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const ActionButtons = ({ selectedCount, onCancel }) => {
  return (
    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
      <Space>
        <span className="text-gray-600">
          {selectedCount} {selectedCount > 1 ? "أسئلة محددة" : "سؤال محدد"}
        </span>

        <Button type="default" icon={<CloseOutlined />} onClick={onCancel}>
          إلغاء التحديد
        </Button>

        {/* يمكنك إضافة أزرار إضافية هنا حسب الحاجة */}
      </Space>
    </div>
  );
};

export default ActionButtons;
