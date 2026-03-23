import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-[-1] h-full w-full bg-[#00091d] bg-[radial-gradient(#ffffff33_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <Navbar />

      <main className="flex-grow w-full">
        <Manager />
      </main>

      <Footer />
    </div>
  );
}

export default App;
