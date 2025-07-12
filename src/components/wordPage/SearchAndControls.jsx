// في ملف SearchAndControls.jsx

// 1. احذف استيراد الأيقونات غير المستخدمة
// import { Search, X, Grid3X3, List } from "lucide-react";
import { Search, X } from "lucide-react";

// 2. عدل المكون لإزالة أزرار التحكم في العرض
const SearchAndControls = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  filteredWordsCount,
  totalWordsCount,
}) => {
  return (
    <div className="mb-6 relative z-10 space-y-4">
      {/* شريط البحث */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="ابحث عن كلمة..."
          value={searchTerm}
          onChange={onSearchChange}
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
        />
        {searchTerm && (
          <button
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* عدل هذا الجزء لإظهار عدد النتائج فقط */}
      {searchTerm && (
        <div className="text-xs text-gray-500 text-left">
          {filteredWordsCount === 0
            ? "لم يتم العثور على كلمات مطابقة"
            : `${filteredWordsCount} كلمة من أصل ${totalWordsCount}`}
        </div>
      )}
    </div>
  );
};

export default SearchAndControls;
