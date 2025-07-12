// components/ContextMenu.jsx
import React, { useRef, useEffect } from "react";
import { Edit3, Trash2, Star, StarOff } from "lucide-react";

const ContextMenu = ({
  visible,
  x,
  y,
  onEdit,
  onDelete,
  onClose,
  onMarkImportant,
  onMarkUnimportant,
  isImportant,
}) => {
  const contextMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      ref={contextMenuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-40 z-50"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -10px)",
      }}
    >
      <ul className="text-sm">
        <li>
          <button
            onClick={isImportant ? onMarkUnimportant : onMarkImportant}
            className="w-full px-4 py-2 text-right hover:bg-yellow-50 transition-colors flex items-center gap-2 text-yellow-600"
          >
            {isImportant ? <StarOff size={14} /> : <Star size={14} />}
            {isImportant ? "إزالة الأهمية" : "تحديد كمهمة"}
          </button>
        </li>
        <li>
          <button
            onClick={onEdit}
            className="w-full px-4 py-2 text-right hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Edit3 size={14} />
            تعديل
          </button>
        </li>
        <li>
          <button
            onClick={onDelete}
            className="w-full px-4 py-2 text-right hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600"
          >
            <Trash2 size={14} />
            حذف
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
