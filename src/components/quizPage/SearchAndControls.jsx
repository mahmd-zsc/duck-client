import React from "react";
import { Input, Button, Space, Select } from "antd";
import {
  SearchOutlined,
  ClearOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const SearchAndControls = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  viewMode,
  onToggleViewMode,
  filteredQuizzesCount,
  totalQuizzesCount,
  onRuleFilterChange,
  selectedRule,
  rules,
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* شريط البحث */}
        <div className="flex-1">
          <Search
            placeholder="ابحث عن أسئلة..."
            allowClear
            enterButton={<SearchOutlined />}
            size="large"
            value={searchTerm}
            onChange={onSearchChange}
            onSearch={onSearchChange}
            className="w-full"
            dir="rtl"
          />
        </div>

        {/* أزرار التحكم */}
        <div className="flex items-center gap-2">
          {/* فلترة حسب القاعدة */}
          <Select
            placeholder="تصفية حسب القاعدة"
            suffixIcon={<FilterOutlined />}
            style={{ width: 180 }}
            allowClear
            value={selectedRule}
            onChange={onRuleFilterChange}
            options={rules.map((rule) => ({
              value: rule.rule,
              label: `${rule.rule} (${rule.count})`,
            }))}
          />

          {/* تبديل طريقة العرض */}
          <Button
            type={viewMode === "grid" ? "primary" : "default"}
            icon={<AppstoreOutlined />}
            onClick={() => onToggleViewMode("grid")}
            title="عرض شبكي"
          />
          <Button
            type={viewMode === "list" ? "primary" : "default"}
            icon={<UnorderedListOutlined />}
            onClick={() => onToggleViewMode("list")}
            title="عرض كقائمة"
          />

          {/* زر مسح البحث */}
          {searchTerm && (
            <Button
              type="default"
              icon={<ClearOutlined />}
              onClick={onClearSearch}
              title="مسح البحث"
            />
          )}
        </div>
      </div>

      {/* إحصائيات النتائج */}
      <div className="mt-3 text-sm text-gray-500">
        {searchTerm || selectedRule ? (
          <span>
            عرض {filteredQuizzesCount} من أصل {totalQuizzesCount} سؤال
          </span>
        ) : (
          <span>إجمالي الأسئلة: {totalQuizzesCount}</span>
        )}
      </div>
    </div>
  );
};

export default SearchAndControls;
