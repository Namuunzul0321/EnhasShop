"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const validate = () => {
    const newErrors = { email: "", password: "", passwordConfirm: "" };
    if (!email) newErrors.email = "Имэйл хоосон байна";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Имэйл буруу байна";
    if (!password) newErrors.password = "Нууц үг хоосон байна";
    if (password !== passwordConfirm)
      newErrors.passwordConfirm = "Нууц үг таарахгүй байна";
    setErrors(newErrors);
    return (
      !newErrors.email && !newErrors.password && !newErrors.passwordConfirm
    );
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Алдаа гарлаа");
      localStorage.setItem("userId", data.userId);
      alert(data.message);
      router.push("/sign-in");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-green-200 to-green-300">
      <div className="w-[380px] bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">
          Бүртгүүлэх
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

          <div className="flex flex-col gap-1 relative">
            <label className="text-sm font-medium text-gray-600">
              Нууц үгээ дахин оруулна уу
            </label>
            <input
              type={showPasswordConfirm ? "text" : "password"}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="••••••••"
              className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 ${
                errors.passwordConfirm ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
            >
              {showPasswordConfirm ? "🙈" : "👁️"}
            </button>
            {errors.passwordConfirm && (
              <p className="text-red-500 text-xs">{errors.passwordConfirm}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-4 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition duration-200 shadow-md"
          >
            Бүртгүүлэх
          </button>
          <div>
            <a href="/sign-in" className="text-gray-500">
              Нэвтрэх
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
