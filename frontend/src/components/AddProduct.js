"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "./Header";

export const AddProducts = () => {
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "лаа",
    scents: [],
    colors: [],
  });

  const [files, setFiles] = useState([]);
  const [allScents, setAllScents] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newScent, setNewScent] = useState("");
  const [newColor, setNewColor] = useState("");

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/scents`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAllScents(data))
      .catch(() => setAllScents([]));

    fetch(`${BACKEND_URL}/api/colors`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAllColors(data))
      .catch(() => setAllColors([]));
  }, []);

  const toggleScent = (scent) => {
    setNewProduct((prev) => ({
      ...prev,
      scents: prev.scents.includes(scent)
        ? prev.scents.filter((s) => s !== scent)
        : [...prev.scents, scent],
    }));
  };

  const toggleColor = (color) => {
    setNewProduct((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const addNewScent = async () => {
    const trimmed = newScent.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/scents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Үнэр нэмэхэд алдаа");

      setAllScents((prev) => [...prev, trimmed]);
      setNewProduct((prev) => ({
        ...prev,
        scents: [...prev.scents, trimmed],
      }));
      setNewScent("");
    } catch (err) {
      alert(err.message);
    }
  };

  const addNewColor = async () => {
    const trimmed = newColor.trim();
    if (!trimmed) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Өнгө нэмэхэд алдаа");

      setAllColors((prev) => [...prev, trimmed]);
      setNewProduct((prev) => ({
        ...prev,
        colors: [...prev.colors, trimmed],
      }));
      setNewColor("");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price)
      return alert("Нэр болон үнийг заавал оруулна уу");

    setLoading(true);

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("scents", JSON.stringify(newProduct.scents));
    formData.append("colors", JSON.stringify(newProduct.colors));

    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Алдаа гарлаа");

      router.push("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="min-h-[calc(100vh-4rem)] bg-green-50 flex justify-center items-start py-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <h2 className="text-2xl font-bold text-center">
            🕯 Бүтээгдэхүүн нэмэх
          </h2>

          <input
            type="text"
            placeholder="Нэр"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />

          <textarea
            placeholder="Тайлбар"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-2 h-24 resize-none focus:ring-2 focus:ring-green-400 outline-none"
          />

          <input
            type="number"
            placeholder="Үнэ"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          />

          <div>
            <p className="font-medium mb-2">📦 Ангилал сонгох</p>
            <div className="flex gap-2">
              {["лаа", "decor"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() =>
                    setNewProduct({ ...newProduct, category: cat })
                  }
                  className={`px-4 py-2 rounded-full border ${
                    newProduct.category === cat
                      ? "bg-green-500 text-white"
                      : "bg-white hover:border-green-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SCENTS */}
          {newProduct.category === "лаа" && (
            <div>
              <p className="font-medium mb-2">🌸 Үнэр сонгох</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {allScents.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleScent(s)}
                    className={`px-4 py-2 border rounded-full ${
                      newProduct.scents.includes(s)
                        ? "bg-green-500 text-white"
                        : "bg-white hover:border-green-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Шинэ үнэр"
                  value={newScent}
                  onChange={(e) => setNewScent(e.target.value)}
                  className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
                />
                <button
                  onClick={addNewScent}
                  className="px-4 py-2 bg-green-500 text-white rounded-xl"
                >
                  Нэмэх
                </button>
              </div>
            </div>
          )}

          {/* COLORS */}
          <div>
            <p className="font-medium mb-2">🎨 Өнгө сонгох</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {allColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleColor(c)}
                  className={`px-4 py-2 border rounded-full ${
                    newProduct.colors.includes(c)
                      ? "bg-green-500 text-white"
                      : "bg-white hover:border-green-400"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Шинэ өнгө"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={addNewColor}
                className="px-4 py-2 bg-green-500 text-white rounded-xl"
              >
                Нэмэх
              </button>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">📷 Зураг</p>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full border rounded-xl px-4 py-2"
            />
          </div>

          <button
            disabled={loading}
            onClick={handleAddProduct}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {loading ? "Нэмэж байна..." : "Нэмэх"}
          </button>
        </div>
      </div>
    </div>
  );
};
