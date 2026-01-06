"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Backend wake-up request
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/health`)
      .then(() => console.log("Backend awake"))
      .catch(() => console.log("Backend waking up"));
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-200 via-green-300 to-green-400">
      <div className="mb-10 animate-float">
        <img
          src="/logo.png"
          alt="Logo"
          className="h-40 sm:h-52 md:h-64 w-auto object-contain drop-shadow-xl rounded-3xl"
        />
      </div>
      <a
        href="/home"
        className="px-6 py-3 rounded-xl bg-white text-green-600 font-semibold shadow-lg animate-pulse-slow hover:scale-105 transition duration-300"
      >
        Тавтай морилно уу
      </a>
    </div>
  );
}
