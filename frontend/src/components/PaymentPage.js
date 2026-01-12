"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const PaymentPage = () => {
  const [order, setOrder] = useState(null);
  const router = useRouter();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const pendingOrder = localStorage.getItem("pendingOrder");
    if (pendingOrder) setOrder(JSON.parse(pendingOrder));
  }, []);

  if (!order) return <div>Захиалга олдсонгүй...</div>;

  const handlePayment = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return alert("Нэвтэрч орно уу");

      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          userEmail,
          phone: order.phone,
          address: order.address,
          items: order.items.map((i) => ({
            productId: i._id,
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            images: i.images?.[0] || "",
            scents: i.scents || [],
            color: i.color || "",
          })),
          total: order.total,
        }),
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || "Алдаа гарлаа");
      }

      // Сагс болон pendingOrder-ийг хоослох
      localStorage.removeItem("cart");
      localStorage.removeItem("pendingOrder");

      alert("Төлбөр амжилттай хийгдлээ!");
      router.push("/orders");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">💳 Төлбөр хийх</h1>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold text-lg mb-2">Захиалгын мэдээлэл</h2>
        <p>
          <strong>Утас:</strong> {order.phone}
        </p>
        <p>
          <strong>Хаяг:</strong> {order.address.district},{" "}
          {order.address.khoroo}, {order.address.details}
        </p>
        <p>
          <strong>Нийт:</strong> {order.total}₮
        </p>

        <h3 className="font-semibold mt-4 mb-2">Бараа:</h3>
        <ul className="list-disc pl-5">
          {order.items.map((i, idx) => (
            <li key={idx}>
              {i.name} - {i.quantity}ш - {i.price * i.quantity}₮
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handlePayment}
        className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
      >
        Би төлбөр төлсөн
      </button>
    </div>
  );
};

export default PaymentPage;
