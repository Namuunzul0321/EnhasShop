const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();

// ======================
// Middleware
// ======================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// MongoDB холболт
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ======================
// Schemas
// ======================

// USER
const userSchema = new mongoose.Schema({
  username: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

// SCENT
const scentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});
const Scent = mongoose.model("Scent", scentSchema);

// COLOR
const colorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});
const Color = mongoose.model("Color", colorSchema);

// PRODUCT
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  images: String,
  price: String,
  scents: [String],
  colors: [String],
  category: { type: String, enum: ["лаа", "decor"], default: "лаа" },
});
const Product = mongoose.model("Product", productSchema);

// ORDER
const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  phone: { type: String, required: true },
  address: {
    district: String,
    khoroo: String,
    details: String,
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      images: String,
      scents: [String],
      color: String,
    },
  ],
  total: Number,
  status: { type: String, default: "Хүлээгдэж буй" },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);

// ======================
// Multer (файл хадгалах)
// ======================
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadDir));

// ======================
// Routes (жишээ: /api/hello)
// ======================
app.get("/api/hello", (_, res) => res.json({ message: "Hello from backend!" }));

// ---------- AUTH ----------
app.post("/api/signup", async (req, res) => {
  try {
    const { email, password, username, phone, isAdmin } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email/password хоосон" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email бүртгэлтэй" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashed,
      username,
      phone,
      isAdmin,
    });
    await user.save();

    res.status(201).json({ message: "Бүртгэл амжилттай", userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
});

app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Хэрэглэгч олдсонгүй" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Нууц үг буруу" });

    const userData = {
      id: user._id,
      email: user.email,
      username: user.username,
      phone: user.phone,
      isAdmin: user.isAdmin,
    };
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Серверийн алдаа" });
  }
});

// ======================
// Server
// ======================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`)
);
