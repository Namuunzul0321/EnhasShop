"use client";

import { useEffect, useState } from "react";

export const Products = () => {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedScent, setSelectedScent] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // ======= Edit states =======
  const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);
  const [editImages, setEditImages] = useState([]);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editScents, setEditScents] = useState([]);
  const [editColors, setEditColors] = useState([]);
  const [editCategory, setEditCategory] = useState("лаа");

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/products`, {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);
    fetchProducts();
  }, []);

  const handleAddToCart = () => {
    if (selectedProduct.category === "лаа" && !selectedScent)
      return alert("Үнэрээ сонгоно уу 🌸");
    if (!selectedColor) return alert("Өнгө сонгоно уу 🎨");

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const key = `${selectedProduct._id}-${selectedScent}-${selectedColor}`;
    const existing = cart.find((i) => i.key === key);

    if (existing) existing.quantity += 1;
    else
      cart.push({
        key,
        _id: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        images: selectedProduct.images,
        scents: selectedScent,
        color: selectedColor,
        quantity: 1,
      });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("Сагсанд нэмэгдлээ 🛒");
    setSelectedProduct(null);
    setSelectedScent("");
    setSelectedColor("");
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Энэ бүтээгдэхүүнийг устгах уу?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/products/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Устгах явцад алдаа гарлаа");
      setProducts(products.filter((p) => p._id !== productId));
      alert("Бүтээгдэхүүн устлаа");
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  return (
    <div className="w-full flex justify-center mt-5 md:mt-10">
      <div className="max-w-[1575px] w-full px-4">
        <h2 className="font-bold text-[32px] mb-6 text-center sm:text-left">
          Бүтээгдэхүүнүүд
        </h2>

        {/* Категори filter */}
        <div className="flex gap-4 mb-4">
          {["all", "лаа", "decor"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-full border ${
                filterCategory === cat
                  ? "bg-green-500 text-white"
                  : "bg-white hover:border-green-400"
              }`}
            >
              {cat === "all" ? "Бүгд" : cat}
            </button>
          ))}
        </div>

        {/* Бүтээгдэхүүнүүд */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition relative"
            >
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleDeleteProduct(p._id)}
                    className="absolute top-2 right-2 z-50 bg-red-500 text-white px-3 py-1 rounded font-semibold hover:bg-red-600 shadow"
                  >
                    Устгах
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProductForEdit(p);
                      setEditName(p.name);
                      setEditPrice(p.price);
                      setEditDescription(p.description);
                      setEditScents(p.scents || []);
                      setEditColors(p.colors || []);
                      setEditCategory(p.category);
                      setEditImages([]);
                    }}
                    className="absolute top-10 right-2 z-50 bg-blue-500 text-white px-3 py-1 rounded font-semibold hover:bg-blue-600 shadow"
                  >
                    Edit
                  </button>
                </>
              )}

              <img
                src={p.images}
                alt={p.name}
                className="w-full aspect-square object-cover rounded-t-2xl"
              />

              <div className="p-4">
                <h3 className="text-black font-semibold text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-red-500 font-bold">{p.price}₮</span>
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Дэлгэрэнгүй
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PRODUCT DETAIL MODAL */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative mt-10">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-xl"
              >
                ✖
              </button>

              <img
                src={selectedProduct.images}
                className="w-full h-75 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <p className="text-gray-700">{selectedProduct.description}</p>
              <p className="text-red-500 font-bold mt-2">
                {selectedProduct.price}₮
              </p>

              {/* Үнэр сонгох */}
              {selectedProduct.category === "лаа" && (
                <div className="mb-4">
                  <p className="font-medium mb-2">🌸 Үнэр сонгох</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.scents?.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedScent(s)}
                        className={`px-4 py-2 rounded-full border text-sm ${
                          selectedScent === s
                            ? "bg-green-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Өнгө сонгох */}
              <div className="mb-4">
                <p className="font-medium mb-2">🎨 Өнгө сонгох</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors?.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 rounded-full border text-sm ${
                        selectedColor === c
                          ? "bg-green-500 text-white"
                          : "bg-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600"
              >
                Сагсанд нэмэх
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {selectedProductForEdit && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 relative">
              <button
                onClick={() => setSelectedProductForEdit(null)}
                className="absolute top-3 right-3 text-xl"
              >
                ✖
              </button>
              <h2 className="text-2xl font-bold mb-4">Бүтээгдэхүүн засах</h2>

              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Нэр"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="Үнэ"
                  className="border p-2 rounded"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Тайлбар"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  placeholder="Category (лаа/decor)"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={editScents.join(",")}
                  onChange={(e) => setEditScents(e.target.value.split(","))}
                  placeholder="Үнэрүүд (comma separated)"
                  className="border p-2 rounded"
                />
                <input
                  type="text"
                  value={editColors.join(",")}
                  onChange={(e) => setEditColors(e.target.value.split(","))}
                  placeholder="Өнгөнүүд (comma separated)"
                  className="border p-2 rounded"
                />
                <input
                  type="file"
                  multiple
                  onChange={(e) => setEditImages(e.target.files)}
                />
                <button
                  onClick={async () => {
                    const formData = new FormData();
                    formData.append("name", editName);
                    formData.append("price", editPrice);
                    formData.append("description", editDescription);
                    formData.append("category", editCategory);
                    formData.append("scents", JSON.stringify(editScents));
                    formData.append("colors", JSON.stringify(editColors));
                    for (let i = 0; i < editImages.length; i++) {
                      formData.append("images", editImages[i]);
                    }

                    try {
                      const res = await fetch(
                        `${BACKEND_URL}/api/products/${selectedProductForEdit._id}`,
                        { method: "PUT", body: formData }
                      );
                      if (!res.ok) throw new Error("Засах явцад алдаа гарлаа");

                      const updated = await res.json();
                      setProducts(
                        products.map((p) =>
                          p._id === updated._id ? updated : p
                        )
                      );
                      setSelectedProductForEdit(null);
                      alert("Бүтээгдэхүүн амжилттай засагдлаа");
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                  className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600"
                >
                  Засах
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
