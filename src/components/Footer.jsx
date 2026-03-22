import React from "react";

const Footer = () => {
  return (
    <div className="bg-black/50 backdrop-blur-md border-t border-gray-800 text-white text-center py-4 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-10 w-full relative z-10">
      <div className="logo font-bold text-xl tracking-wide">
        <span className="text-indigo-500">&lt;</span>
        <span className="text-white">Nex</span>
        <span className="text-indigo-500">Lockr /&gt;</span>
      </div>

      <div className="text-gray-300 font-medium">
        Made by{" "}
        <span className="text-indigo-400 font-semibold tracking-wide">
          Neeraj
        </span>
      </div>
    </div>
  );
};

export default Footer;
