import React, { forwardRef } from "react";
import { Menu } from "antd";
import { EditOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";

const ContextMenu = forwardRef(
  ({ visible, x, y, onEdit, onDelete, onClose }, ref) => {
    if (!visible) return null;

    const menuStyle = {
      position: "fixed",
      left: x,
      top: y,
      zIndex: 1000,
      boxShadow:
        "0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
      width: 200,
    };

    return (
      <div ref={ref} style={menuStyle}>
        <Menu mode="vertical" selectable={false}>
          <Menu.Item key="edit" icon={<EditOutlined />} onClick={onEdit}>
            تعديل السؤال
          </Menu.Item>
          <Menu.Item
            key="delete"
            icon={<DeleteOutlined />}
            onClick={onDelete}
            danger
          >
            حذف السؤال
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="close" icon={<CloseOutlined />} onClick={onClose}>
            إغلاق
          </Menu.Item>
        </Menu>
      </div>
    );
  }
);

export default ContextMenu;
