"use client";

import { useEffect, useState } from "react";
import { Header } from "./Header";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loadingUser, setLoadingUser] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders`, {
        credentials: "include",
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Статус update хийхэд алдаа");
      fetchOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const viewUserProfile = async (email) => {
    try {
      setLoadingUser(true);
      const resUser = await fetch(`${BACKEND_URL}/api/users/email/${email}`, {
        credentials: "include",
      });
      const userData = await resUser.json();
      setSelectedUser(userData);

      const resOrders = await fetch(`${BACKEND_URL}/api/orders/user/${email}`, {
        credentials: "include",
      });
      const ordersData = await resOrders.json();
      setUserOrders(ordersData);
      setLoadingUser(false);
    } catch (err) {
      console.error(err);
      setLoadingUser(false);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Хүлээгдэж буй":
        return "bg-yellow-200 text-yellow-800";
      case "Баталгаажсан":
        return "bg-blue-200 text-blue-800";
      case "Хүргэлтэнд":
        return "bg-orange-200 text-orange-800";
      case "Хүргэгдсэн":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const filterOrders = () => {
    if (statusFilter === "all") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.status === statusFilter));
  };

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Захиалгууд</h1>

        {/* Статус шүүлт */}
        <div className="mb-4 flex gap-2 flex-wrap">
          {[
            "all",
            "Хүлээгдэж буй",
            "Баталгаажсан",
            "Хүргэлтэнд",
            "Хүргэгдсэн",
          ].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded ${
                statusFilter === s
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {s === "all" ? "Бүгд" : s}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 && <p>Захиалга байхгүй байна</p>}

        {filteredOrders.map((o) => (
          <div
            key={o._id}
            className="border p-4 rounded mb-4 bg-white dark:bg-gray-800"
          >
            <p>
              <strong>Email:</strong>{" "}
              <button
                onClick={() => viewUserProfile(o.userEmail)}
                className="text-blue-600 hover:underline"
              >
                {o.userEmail}
              </button>
            </p>
            <p>
              <strong>Утас:</strong> {o.phone}
            </p>
            <p>
              <strong>Хаяг:</strong>{" "}
              {o.address
                ? `${o.address.district}, ${o.address.khoroo}, ${o.address.details}`
                : "Хаяг оруулаагүй"}
            </p>
            <p>
              <strong>Нийт:</strong> {o.total}₮
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded font-semibold ${statusColor(
                  o.status
                )}`}
              >
                {o.status}
              </span>
            </p>

            <div className="mt-4">
              <strong>Бүтээгдэхүүнүүд:</strong>
              {o.items?.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {o.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-4 border p-2 rounded"
                    >
                      <img
                        src={item.images?.split(",")[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p>Үнэ: {item.price}₮</p>
                        <p>Тоо ширхэг: {item.quantity}</p>
                        <p>
                          Үнэр:{" "}
                          {item.scents?.length > 0
                            ? item.scents.join(", ")
                            : "Үнэр сонгогдоогүй"}
                        </p>
                        <p>Өнгө: {item.color || "Сонгогдоогүй"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Бүтээгдэхүүн байхгүй</p>
              )}
            </div>

            <div className="flex gap-2 mt-2 flex-wrap">
              {o.status === "Баталгаажсан" && o.status !== "Хүлээгдэж буй" && (
                <button
                  onClick={() => updateStatus(o._id, "Хүлээгдэж буй")}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Хүлээгдэж буй
                </button>
              )}
              {o.status !== "Баталгаажсан" && (
                <button
                  onClick={() => updateStatus(o._id, "Баталгаажсан")}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Баталгаажсан
                </button>
              )}
              {o.status !== "Хүргэлтэнд" && o.status !== "Хүлээгдэж буй" && (
                <button
                  onClick={() => updateStatus(o._id, "Хүргэлтэнд")}
                  className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
                >
                  Хүргэлтэнд
                </button>
              )}
              {o.status !== "Хүргэгдсэн" && o.status === "Хүргэлтэнд" && (
                <button
                  onClick={() => updateStatus(o._id, "Хүргэгдсэн")}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Хүргэлт дуусгах
                </button>
              )}
            </div>
          </div>
        ))}

        {/* User Profile Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50 overflow-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-3 right-3 text-red-500 font-bold text-lg"
              >
                X
              </button>
              <h2 className="text-xl font-bold mb-4">Хэрэглэгчийн мэдээлэл</h2>
              <p>
                <strong>Нэр:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Утас:</strong> {selectedUser.phone || "Байхгүй"}
              </p>

              <h3 className="mt-4 font-semibold">Захиалгууд</h3>
              {loadingUser ? (
                <p>Ачааллаж байна...</p>
              ) : userOrders.length === 0 ? (
                <p>Захиалга байхгүй</p>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {userOrders.map((o) => (
                    <div
                      key={o._id}
                      className="border p-2 rounded flex flex-col gap-1"
                    >
                      <p>
                        <strong>Огноо:</strong>{" "}
                        {new Date(o.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Нийт:</strong> {o.total}₮
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`px-2 py-1 rounded font-semibold ${statusColor(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </p>
                      <div className="ml-2">
                        {o.items.map((i, idx) => (
                          <p key={idx}>
                            • {i.name} ({i.quantity}) - {i.price}₮
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
