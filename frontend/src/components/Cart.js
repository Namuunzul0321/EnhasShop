"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";

const districts = {
  Баянгол: ["1-р хороо", "2-р хороо", "3-р хороо"], // жишээ
  Баянзүрх: ["1-р хороо", "2-р хороо", "3-р хороо"],
  Сонгинохайрхан: ["1-р хороо", "2-р хороо", "3-р хороо"],
  Сүхбаатар: ["1-р хороо", "2-р хороо", "3-р хороо"],
  "Хан-Уул": ["1-р хороо", "2-р хороо", "3-р хороо"],
  Чингэлтэй: ["1-р хороо", "2-р хороо", "3-р хороо"],
};

export const Cart = () => {
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [khoroo, setKhoroo] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increase = (key) => {
    updateCart(
      cart.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decrease = (key) => {
    updateCart(
      cart
        .map((i) => (i.key === key ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const validatePhone = (num) => /^[0-9]{8}$/.test(num);

  const handleCheckout = async () => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) return alert("Нэвтэрч орно уу");

    if (!validatePhone(phone))
      return alert("Утасны дугаар 8 оронтой байх ёстой");

    if (!district || !khoroo || !details)
      return alert("Бүх хаягийн талбарыг бөглөнө үү");

    try {
      const res = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail,
          phone,
          address: {
            district,
            khoroo,
            details,
          },
          items: cart.map((i) => ({
            productId: i._id,
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            images: i.images || "",
            scents: i.scents || [],
            color: i.color || "",
          })),
          total,
        }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || "Алдаа гарлаа");
      }

      const data = await res.json();
      alert("Захиалга амжилттай хийгдлээ");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      alert(err.message);
    }
  };

  if (cart.length === 0)
    return (
      <div>
        <Header />
        <div className="h-[60vh] flex items-center justify-center text-gray-500">
          🛒 Сагс хоосон байна
        </div>
      </div>
    );

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">🛒 Сагс</h1>

        {cart.map((item) => (
          <div
            key={item.key}
            className="flex gap-4 bg-white rounded-xl shadow p-4 mb-4"
          >
            <img
              src={item.images?.split(",")[0]}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>

              {/* Сонгосон өнгө ба үнэр */}
              {/* Сонгосон өнгө ба үнэр */}
              <div className="mt-1 text-sm text-gray-600">
                {item.color && (
                  <p>
                    <strong>Өнгө:</strong> {item.color}
                  </p>
                )}
                <p>
                  <strong>Үнэр:</strong>{" "}
                  {Array.isArray(item.scents)
                    ? item.scents.join(", ")
                    : item.scents || "Үнэр сонгогдоогүй"}
                </p>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => decrease(item.key)}
                  className="px-2 bg-gray-200 rounded"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => increase(item.key)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="font-bold text-green-600">
              {item.price * item.quantity}₮
            </div>
          </div>
        ))}

        <div className="my-4">
          <input
            type="text"
            placeholder="Утасны дугаар"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border px-3 py-2 rounded mb-2 w-full"
          />

          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setKhoroo("");
            }}
            className="border px-3 py-2 rounded mb-2 w-full"
          >
            <option value="">Дүүрэг сонгоно уу</option>
            {Object.keys(districts).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={khoroo}
            onChange={(e) => setKhoroo(e.target.value)}
            className="border px-3 py-2 rounded mb-2 w-full"
            disabled={!district}
          >
            <option value="">Хороо сонгоно уу</option>
            {district &&
              districts[district].map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
          </select>

          <input
            type="text"
            placeholder="Дэлгэрэнгүй хаяг (гудамж, байр, тоот)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div className="text-right text-xl font-bold mt-6">Нийт: {total}₮</div>

        <button
          onClick={handleCheckout}
          className="mt-4 w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Захиалах
        </button>
      </div>
    </div>
  );
};

export default Cart;
