import React from "react";
import { Home, BookOpen, StickyNote, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../../../images/Lexi.png";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      label: "الصفحة الرئيسية",
      icon: Home,
    },
    {
      path: "/words",
      label: "الكلمات",
      icon: BookOpen,
    },
    {
      path: "/quizzes", // تمت إضافتها
      label: "أسئلة الترجمة", // تمت إضافتها
      icon: HelpCircle, // تمت إضافتها
    },
    {
      path: "/notes",
      label: "الملاحظات",
      icon: StickyNote,
    },
  ];

  return (
    <>
      <div className="w-80 flex-shrink-0" aria-hidden="true"></div>
      <div
        className="fixed top-0 right-0 w-80 h-screen bg-white border-l border-gray-100 flex flex-col"
        dir="rtl"
      >
        <div className="relative flex items-center justify-center py-8 px-6">
          <img className="h-42 w-auto" src={logoImage} alt="Logo" />
          <div className="absolute w-full h-full"></div>
        </div>

        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center gap-4 px-6 py-4 rounded-2xl text-base font-normal transition-all duration-200
                      ${
                        isActive
                          ? "bg-gray-900 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="text-center text-xs text-gray-400">إصدار 1.0</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
