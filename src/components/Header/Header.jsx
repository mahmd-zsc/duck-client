import { useState } from "react";
import { Link } from "react-router-dom";
import logoImage from "../../../images/BaNaNa_DuCk-removebg-preview.png"; // Using proper import for images
import german from "../../../images/flag.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="  px-10  border-b-2 border-white  bg-white ">
      {" "}
      {/* Added background color */}
      <div className="container mx-auto  ">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img
              src={logoImage}
              alt="Logo"
              className="h-20 " // Added fixed height
            />
          </Link>

         
          <img className=" h-10" src={german} alt="" />
        </div>
      </div>
    </header>
  );
}
