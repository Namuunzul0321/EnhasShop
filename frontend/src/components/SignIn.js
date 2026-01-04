"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const validate = () => {
    const newErrors = { email: "", password: "" };
    if (!email) newErrors.email = "Имэйл хоосон байна";
    if (!password) newErrors.password = "Нууц үг хоосон байна";
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Алдаа гарлаа");
      localStorage.setItem("userId", data.id);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("isAdmin", data.isAdmin);
      router.push("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-green-200 to-green-300">
      <div className="w-[380px] bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Нэвтрэх
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-600">Нууц үг</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-200 shadow-md"
          >
            Нэвтрэх
          </button>

          <div>
            <a href="/sign-up" className="text-gray-500">
              Бүртгэл үүсгэх
            </a>
          </div>
          <div className="mt-2 text-center">
            <a
              href="/forgot"
              className="text-green-600 hover:underline text-sm"
            >
              Нууц үг мартсан уу?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
