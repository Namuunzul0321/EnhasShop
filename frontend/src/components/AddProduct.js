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

  // ======================
  // Fetch scents & colors
  // ======================
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/scents`)
      .then((res) => res.json())
      .then(setAllScents)
      .catch(() => setAllScents([]));

    fetch(`${BACKEND_URL}/api/colors`)
      .then((res) => res.json())
      .then(setAllColors)
      .catch(() => setAllColors([]));
  }, []);

  // ======================
  // Helpers
  // ======================
  const toggleScent = (s) => {
    setNewProduct((p) => ({
      ...p,
      scents: p.scents.includes(s)
        ? p.scents.filter((x) => x !== s)
        : [...p.scents, s],
    }));
  };

  const toggleColor = (c) => {
    setNewProduct((p) => ({
      ...p,
      colors: p.colors.includes(c)
        ? p.colors.filter((x) => x !== c)
        : [...p.colors, c],
    }));
  };

  // ======================
  // ADD PRODUCT
  // ======================
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      return alert("Нэр болон үнийг заавал оруулна уу");
    }

    if (!files || files.length === 0) {
      return alert("Дор хаяж 1 зураг оруулна уу");
    }

    if (files.length > 5) {
      return alert("Хамгийн ихдээ 5 зураг upload хийж болно");
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);
    formData.append("category", newProduct.category);
    formData.append("scents", JSON.stringify(newProduct.scents));
    formData.append("colors", JSON.stringify(newProduct.colors));

    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();

      if (!res.ok) {
        console.error(text);
        throw new Error("Product нэмэхэд алдаа гарлаа");
      }

      JSON.parse(text); // backend JSON OK гэдгийг батална
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
      <div className="min-h-[calc(100vh-4rem)] bg-green-50 flex justify-center py-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">
            🕯 Бүтээгдэхүүн нэмэх
          </h2>

          <input
            placeholder="Нэр"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Тайлбар"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Үнэ"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="w-full border p-2 rounded"
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

          {/* IMAGES */}
          <p className="font-medium mb-2">📷 Зураг</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
          />

          <button
            disabled={loading}
            onClick={handleAddProduct}
            className="w-full bg-green-500 text-white py-2 rounded font-semibold"
          >
            {loading ? "Нэмэж байна..." : "Нэмэх"}
          </button>
        </div>
      </div>
    </div>
  );
};
