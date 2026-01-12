"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";

const districts = {
  Баянгол: [
    "1-р хороо",
    "2-р хороо",
    "3-р хороо",
    "4-р хороо",
    "5-р хороо",
    "6-р хороо",
    "7-р хороо",
    "8-р хороо",
    "9-р хороо",
    "10-р хороо",
    "11-р хороо",
    "12-р хороо",
    "13-р хороо",
    "14-р хороо",
    "15-р хороо",
    "16-р хороо",
    "17-р хороо",
    "18-р хороо",
    "19-р хороо",
    "20-р хороо",
    "21-р хороо",
    "22-р хороо",
    "23-р хороо",
    "24-р хороо",
    "25-р хороо",
    "26-р хороо",
    "27-р хороо",
    "28-р хороо",
    "29-р хороо",
    "30-р хороо",
    "31-р хороо",
    "32-р хороо",
    "33-р хороо",
    "34-р хороо",
  ],

  Баянзүрх: [
    "1-р хороо",
    "2-р хороо",
    "3-р хороо",
    "4-р хороо",
    "5-р хороо",
    "6-р хороо",
    "7-р хороо",
    "8-р хороо",
    "9-р хороо",
    "10-р хороо",
    "11-р хороо",
    "12-р хороо",
    "13-р хороо",
    "14-р хороо",
    "15-р хороо",
    "16-р хороо",
    "17-р хороо",
    "18-р хороо",
    "19-р хороо",
    "20-р хороо",
    "21-р хороо",
    "22-р хороо",
    "23-р хороо",
    "24-р хороо",
    "25-р хороо",
    "26-р хороо",
    "27-р хороо",
    "28-р хороо",
    "29-р хороо",
    "30-р хороо",
    "31-р хороо",
    "32-р хороо",
    "33-р хороо",
    "34-р хороо",
    "35-р хороо",
    "36-р хороо",
    "37-р хороо",
    "38-р хороо",
    "39-р хороо",
    "40-р хороо",
    "41-р хороо",
    "42-р хороо",
    "43-р хороо",
  ],

  Сонгинохайрхан: [
    "1-р хороо",
    "2-р хороо",
    "3-р хороо",
    "4-р хороо",
    "5-р хороо",
    "6-р хороо",
    "7-р хороо",
    "8-р хороо",
    "9-р хороо",
    "10-р хороо",
    "11-р хороо",
    "12-р хороо",
    "13-р хороо",
    "14-р хороо",
    "15-р хороо",
    "16-р хороо",
    "17-р хороо",
    "18-р хороо",
    "19-р хороо",
    "20-р хороо",
    "21-р хороо",
    "22-р хороо",
    "23-р хороо",
    "24-р хороо",
    "25-р хороо",
    "26-р хороо",
    "27-р хороо",
    "28-р хороо",
    "29-р хороо",
    "30-р хороо",
    "31-р хороо",
    "32-р хороо",
    "33-р хороо",
    "34-р хороо",
    "35-р хороо",
    "36-р хороо",
    "37-р хороо",
    "38-р хороо",
    "39-р хороо",
    "40-р хороо",
    "41-р хороо",
    "42-р хороо",
    "43-р хороо",
  ],

  Сүхбаатар: [
    "1-р хороо",
    "2-р хороо",
    "3-р хороо",
    "4-р хороо",
    "5-р хороо",
    "6-р хороо",
    "7-р хороо",
    "8-р хороо",
    "9-р хороо",
    "10-р хороо",
    "11-р хороо",
    "12-р хороо",
    "13-р хороо",
    "14-р хороо",
    "15-р хороо",
    "16-р хороо",
    "17-р хороо",
    "18-р хороо",
    "19-р хороо",
    "20-р хороо",
  ],

  "Хан-Уул": [
    "1-р хороо",
    "2-р хороо",
    "3-р хороо",
    "4-р хороо",
    "5-р хороо",
    "6-р хороо",
    "7-р хороо",
    "8-р хороо",
    "9-р хороо",
    "10-р хороо",
    "11-р хороо",
    "12-р хороо",
    "13-р хороо",
    "14-р хороо",
    "15-р хороо",
    "16-р хороо",
    "17-р хороо",
    "18-р хороо",
    "19-р хороо",
    "20-р хороо",
    "21-р хороо",
    "22-р хороо",
    "23-р хороо",
    "24-р хороо",
    "25-р хороо",
  ],

  Чингэлтэй: [
    "1-р хороо",
    "2-р хороо",
    "3-р хороо",
    "4-р хороо",
    "5-р хороо",
    "6-р хороо",
    "7-р хороо",
    "8-р хороо",
    "9-р хороо",
    "10-р хороо",
    "11-р хороо",
    "12-р хороо",
    "13-р хороо",
    "14-р хороо",
    "15-р хороо",
    "16-р хороо",
    "17-р хороо",
    "18-р хороо",
    "19-р хороо",
    "20-р хороо",
    "21-р хороо",
    "22-р хороо",
    "23-р хороо",
    "24-р хороо",
  ],
};

export const Cart = () => {
  const [cart, setCart] = useState([]);
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [khoroo, setKhoroo] = useState("");
  const [details, setDetails] = useState("");
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openKhoroo, setOpenKhoroo] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
            images: i.images?.[0] || "",
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
        <div className="h-[60vh] flex items-center justify-center text-gray-500 flex-col">
          🛒 Сагс хоосон байна
          <div>Та захиалгаа профайл хэсгээс харна уу</div>
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
              src={item.images?.[0]}
              className="w-24 h-24 object-cover rounded"
            />

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>

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

          <div className="relative mb-2">
            <button
              onClick={() => {
                setOpenDistrict(!openDistrict);
                setOpenKhoroo(false);
              }}
              className="w-full border px-3 py-2 rounded text-left bg-white"
            >
              {district || "Дүүрэг сонгоно уу"}
            </button>

            {openDistrict && (
              <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto border bg-white rounded shadow">
                {Object.keys(districts).map((d) => (
                  <div
                    key={d}
                    onClick={() => {
                      setDistrict(d);
                      setKhoroo("");
                      setOpenDistrict(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {d}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative mb-2">
            <button
              onClick={() => district && setOpenKhoroo(!openKhoroo)}
              disabled={!district}
              className={`w-full border px-3 py-2 rounded text-left bg-white ${
                !district ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            >
              {khoroo || "Хороо сонгоно уу"}
            </button>

            {openKhoroo && district && (
              <div className="absolute z-20 mt-1 w-full max-h-48 overflow-y-auto border bg-white rounded shadow">
                {districts[district].map((k) => (
                  <div
                    key={k}
                    onClick={() => {
                      setKhoroo(k);
                      setOpenKhoroo(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {k}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            placeholder="Дэлгэрэнгүй хаяг (гудамж, байр, тоот)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
        </div>

        <div className="text-right text-xl font-bold mt-6">Нийт: {total}₮</div>
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-2">Дансны мэдээлэл</h2>

          <div className="flex items-center justify-between border p-3 rounded mb-2">
            <span>1234 5678 9012 3456</span> {/* Жишээ данс */}
            <button
              onClick={() => {
                navigator.clipboard.writeText("1234 5678 9012 3456");
                alert("Дансны дугаар хуулагдлаа ✅");
              }}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Copy
            </button>
          </div>

          <div className="flex items-center justify-between border p-3 rounded mb-2">
            <span>Банкны нэр: Голомт Банк</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("Голомт Банк");
                alert("Банкны нэр хуулагдлаа ✅");
              }}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Copy
            </button>
          </div>

          <div className="flex items-center justify-between border p-3 rounded">
            <span>Хүлээн авагчийн нэр: Нэр Нэр</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("Нэр Нэр");
                alert("Хүлээн авагчийн нэр хуулагдлаа ✅");
              }}
              className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
        </div>

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
