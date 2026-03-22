import React from "react";
import githubIcon from "../assets/Github.svg";

const Navbar = () => {
  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="mycontainer flex justify-between items-center mx-auto px-4 py-3 h-16">
        <div className="logo font-bold text-2xl tracking-wide">
          <span className="text-indigo-500">&lt;</span>
          <span className="text-white">Nex</span>
          <span className="text-indigo-500">Lockr /&gt;</span>
        </div>

        <a
          href="https://github.com/NeerajSaini271"
          target="_blank"
          rel="noreferrer"
          className="relative inline-flex h-10 w-fit overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50 hover:scale-105 transition-transform"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex gap-2 h-full w-full cursor-pointer items-center justify-center rounded-full bg-gray-950 px-5 py-1 text-sm font-medium text-gray-50 backdrop-blur-3xl">
            <img
              className="invert w-5 h-5"
              // src="src\assets\Github.svg"
              src={githubIcon}
              alt="Github Logo"
            />
            <span className="font-semibold">Github</span>
          </span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
