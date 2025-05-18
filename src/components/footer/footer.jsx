// Footer.jsx
import React from "react";
import img from "../../../images/bundesadler.png"
function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white px-10 py-4 ">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
<img className="h-10" src={img} alt="" />


        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} LangBoost. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
