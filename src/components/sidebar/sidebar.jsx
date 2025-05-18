import React from "react";
import { FaHome, FaBookOpen } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import logoImage from "../../../images/download__2_-removebg-preview.png"; // Using proper import for images

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-80 h-screen bg-white  border-gray-200 border-l-1 text-right font-sans">
      {/* Logo/Title */}
      <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center my-10">
        <img className=" h-40" src={logoImage} alt="" />
      </h1>

      {/* Navigation Menu */}
      <nav>
        <ul className="">
          <li>
            <Link
              to="/"
              className={`flex items-center justify-end gap-4 text-xl py-6 pr-4 font-bold
                ${
                  location.pathname === "/"
                    ? "   border-l-8 border-yellow-400  bg-gray-100"
                    : "text-gray-700 "
                }`}
            >
              <span>الصفحة الرئيسية</span>
              <FaHome className="text-3xl" />
            </Link>
          </li>
          <li>
            <Link
              to="/words"
              className={`flex items-center justify-end gap-4 text-xl py-6 pr-4 font-bold
                ${
                  location.pathname === "/words"
                    ? "border-l-8 border-yellow-400 bg-gray-100"
                    : "text-gray-700 "
                }`}
            >
              <span>الكلمات</span>
              <FaBookOpen className="text-3xl" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
