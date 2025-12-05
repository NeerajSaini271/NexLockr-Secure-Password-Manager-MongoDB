import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-12">
        <div className="logo font-bold text-xl">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP / &gt;</span>
        </div>
        <button className="flex items-center gap-3 bg-slate-900 px-1 py-1 rounded-full cursor-pointer hover:bg-slate-950 ring-white ring-1">
          <a
            className="flex items-center gap-3"
            href="https://github.com/NeerajSaini271"
            target="_blank"
          >
            <img
              className="invert cursor-pointer"
              src="src\assets\Github.svg"
              alt="Github Logo"
            />
            <span className="font-semibold">Github</span>
          </a>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
