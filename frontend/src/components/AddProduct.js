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

    if (files.length === 0) {
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

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Product нэмэхэд алдаа гарлаа");

      await res.json();
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

          {/* CATEGORY */}
          <div>
            <p className="font-medium mb-2">📦 Ангилал</p>
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
                      : "bg-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* IMAGES */}
          <div>
            <p className="font-medium mb-2">📷 Зураг (max 5)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const selected = Array.from(e.target.files);
                setFiles((prev) => [...prev, ...selected].slice(0, 5));
                e.target.value = "";
              }}
            />

            {/* PREVIEW */}
            <div className="flex gap-2 flex-wrap mt-3">
              {files.map((file, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    onClick={() =>
                      setFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

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
