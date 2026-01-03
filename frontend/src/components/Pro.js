"use client";
import { useEffect, useState } from "react";
import { Header } from "./Header";

export const Pro = () => {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({ email: "", phone: "" });
  const [orders, setOrders] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // filter нэмэгдсэн

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("userId");
      if (id) {
        setUserId(id);
        fetchUser(id);
      } else {
        setErrors("Хэрэглэгчийн мэдээлэл олдсонгүй");
        setLoading(false);
      }
    }
  }, []);

  const fetchUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${id}`);
      if (!res.ok) throw new Error("Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа");
      const data = await res.json();
      setUserData({ email: data.email, phone: data.phone || "" });
      fetchOrders(data.email);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setErrors(err.message);
      setLoading(false);
    }
  };

  const fetchOrders = async (email) => {
    try {
      const res = await fetch(`http://localhost:4000/api/orders/user/${email}`);
      if (!res.ok) throw new Error("Захиалгын түүх авахад алдаа гарлаа");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const saveUser = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error("Мэдээлэл хадгалахад алдаа гарлаа");
      const data = await res.json();
      setUserData({ email: data.email, phone: data.phone });
      fetchOrders(data.email);
      setEditMode(false);
      alert("Мэдээлэл амжилттай хадгалагдлаа");
    } catch (err) {
      console.error(err.message);
      alert(err.message);
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

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  if (loading) return <div className="p-4 text-center">Ачааллаж байна...</div>;
  if (errors)
    return <div className="p-4 text-red-500 text-center">{errors}</div>;

  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center p-4 bg-gray-100">
        {/* Профайл */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mt-10">
          <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
            Хэрэглэгчийн профайл
          </h1>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-medium">Имэйл</label>
              <input
                type="email"
                value={userData.email}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 ${
                  !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-gray-600 font-medium">Утас</label>
              <input
                type="text"
                value={userData.phone}
                disabled={!editMode}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={`border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 ${
                  !editMode ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="flex justify-between mt-4">
              {editMode ? (
                <>
                  <button
                    onClick={saveUser}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                  >
                    Хадгалах
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Болих
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-500 text-white w-full py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Засах
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Захиалгын түүх */}
        <div className="w-full max-w-3xl mt-8">
          <h2 className="text-xl font-bold mb-4">Таны захиалгууд</h2>

          {/* Status filter */}
          <div className="flex gap-2 mb-4 flex-wrap">
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

          {filteredOrders.length === 0 ? (
            <p className="text-gray-600">
              Таны сонгосон статустай захиалга байхгүй байна.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredOrders.map((o) => (
                <div
                  key={o._id}
                  className={`border p-4 rounded shadow-sm bg-white ${statusColor(
                    o.status
                  )} bg-opacity-20`}
                >
                  <p>
                    <strong>Огноо:</strong>{" "}
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Нийт:</strong> {o.total}₮
                  </p>
                  <p>
                    <strong>Статус:</strong>{" "}
                    <span
                      className={`px-2 py-1 rounded font-semibold ${statusColor(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </p>

                  <div className="mt-2">
                    <strong>Бүтээгдэхүүнүүд:</strong>
                    {o.items && o.items.length > 0 ? (
                      <ul className="list-disc list-inside ml-4">
                        {o.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} ({item.quantity}) - {item.price}₮
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Бүтээгдэхүүн байхгүй</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
