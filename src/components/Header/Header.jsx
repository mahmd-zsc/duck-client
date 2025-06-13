import { useState } from "react";
import { Link } from "react-router-dom";
//import logoImage from "../../../images/BaNaNa_DuCk-removebg-preview.png"; // Using proper import for images
import logoImage from "../../../images/Ivan_Mesaros-removebg-preview.png"; // Using proper import for images

//import german from "../../../images/flag.png";
import german from "../../../images/c02cb0428d208f3b207c66eb4002e5f5-removebg-preview.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="  px-10  border-b-2 border-white  bg-white ">
      {" "}
      {/* Added background color */}
      <div className="container mx-auto  ">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link className=" relative" to="/">
            <div className=" absolute w-full h-full  "></div>

            <img
              src={logoImage}
              alt="Logo"
              className="h-20 " // Added fixed height
            />
          </Link>
          <div className=" relative">
            <div className=" absolute w-full h-full  "></div>
            <img className=" h-10" src={german} alt="" />
          </div>
        </div>
      </div>
    </header>
  );
}
