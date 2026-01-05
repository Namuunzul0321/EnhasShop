"use client";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const params = useParams();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async () => {
    if (!password) return alert("Нууц үг оруулна уу");
    try {
      const res = await fetch(`${BACKEND_URL}/api/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token, password }),
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
        <h1 className="text-2xl font-bold mb-4">Нууц үг шинэчлэх</h1>
        <input
          type="password"
          placeholder="Шинэ нууц үг"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white py-2 rounded w-full"
        >
          Шинэчлэх
        </button>
        {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
