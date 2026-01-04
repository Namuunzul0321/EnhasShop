"use client";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email) return alert("Имэйлээ оруулна уу");
    try {
      const res = await fetch("http://localhost:4000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Алдаа гарлаа. Дахин оролдоно уу");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-[380px] bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">Нууц үг сэргээх</h1>
        <input
          type="email"
          placeholder="Имэйлээ оруулна уу"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white py-2 rounded w-full"
        >
          Илгээх
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
