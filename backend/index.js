const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config(); // .env файлыг уншина
const BACKEND_URL = process.env.BACKEND_URL;
const FRONTEND_URL = process.env.FRONTEND_URL;
const PORT = process.env.PORT || 4000;

const app = express();

// ======================
// Middleware
// ======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      FRONTEND_URL, // deployed frontend
    ],
    credentials: true,
  })
);

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
  resetToken: String,
  resetTokenExpire: Date,
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
  address: { district: String, khoroo: String, details: String },
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
// Nodemailer
// ======================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================
// Routes
// ======================

// Test
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

// ---------- PASSWORD RESET ----------
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.json({ message: "Хэрэв бүртгэлтэй бол имэйл илгээгдэнэ" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 1000 * 60 * 15;
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    await transporter.sendMail({
      to: user.email,
      subject: "Нууц үг сэргээх",
      html: `<p>Нууц үг сэргээх линк:</p><a href="${resetLink}">${resetLink}</a><p>15 минутын дотор хүчинтэй</p>`,
    });

    res.json({ message: "Нууц үг сэргээх линк илгээгдлээ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Алдаа гарлаа" });
  }
});

app.post("/api/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "Token хүчингүй эсвэл хугацаа дууссан" });

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "Нууц үг амжилттай шинэчлэгдлээ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Алдаа гарлаа" });
  }
});

// ---------- PRODUCTS ----------
app.get("/api/products", async (_, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ message: "Products авахад алдаа" });
  }
});

app.post("/api/products", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, scents, colors, category } = req.body;
    if (!name || !price)
      return res.status(400).json({ message: "Нэр, үнэ заавал" });

    const images = req.files.map((f) => `${BACKEND_URL}/uploads/${f.filename}`);
    const product = new Product({
      name,
      description,
      price,
      scents: category === "лаа" ? JSON.parse(scents) : [],
      colors: colors ? JSON.parse(colors) : [],
      category,
      images: images.join(","),
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product нэмэхэд алдаа" });
  }
});

app.put("/api/products/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { name, description, price, scents, colors, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Бүтээгдэхүүн олдсонгүй" });

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (scents) product.scents = JSON.parse(scents);
    if (colors) product.colors = JSON.parse(colors);
    if (req.files && req.files.length > 0)
      product.images = req.files
        .map((f) => `${BACKEND_URL}/uploads/${f.filename}`)
        .join(",");

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product засахад алдаа гарлаа" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Бүтээгдэхүүн олдсонгүй" });
    res.json({ message: "Бүтээгдэхүүн амжилттай устлаа" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Product устгахад алдаа гарлаа" });
  }
});

// ======================
// USERS, ORDERS, SCENTS, COLORS
// ======================

// USER PROFILE
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User мэдээлэл авахад алдаа гарлаа" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    const updatedUser = user.toObject();
    delete updatedUser.password;
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User update хийхэд алдаа гарлаа" });
  }
});

// ORDERS
app.get("/api/orders", async (_, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Orders авахад алдаа" });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const { userEmail, phone, address, items, total } = req.body;
    if (!userEmail || !phone || !address || !items || items.length === 0)
      return res.status(400).json({ message: "Мэдээлэл бүрэн биш" });

    const itemsWithExtras = items.map((i) => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      images: i.images || "",
      scents: i.scents || [],
      color: i.color || [],
    }));

    const order = new Order({
      userEmail,
      phone,
      address,
      items: itemsWithExtras,
      total,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Захиалга хадгалах алдаа" });
  }
});

app.put("/api/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Захиалга олдсонгүй" });

    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update хийхэд алдаа гарлаа" });
  }
});

// GET user by email
app.get("/api/users/email/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User мэдээлэл авахад алдаа гарлаа" });
  }
});

// GET orders by user email
app.get("/api/orders/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({ userEmail: req.params.email });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Захиалгын түүх авахад алдаа" });
  }
});

// SCENTS
app.get("/api/scents", async (_, res) => {
  try {
    const scents = await Scent.find();
    res.json(scents.map((s) => s.name));
  } catch {
    res.status(500).json({ message: "Scents авахад алдаа" });
  }
});

app.post("/api/scents", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Нэр шаардлагатай" });

    const exists = await Scent.findOne({ name });
    if (exists) return res.status(400).json({ message: "Ийм үнэр байна" });

    const scent = await new Scent({ name }).save();
    res.status(201).json(scent);
  } catch {
    res.status(500).json({ message: "Scents нэмэхэд алдаа" });
  }
});

// COLORS
app.get("/api/colors", async (_, res) => {
  try {
    const colors = await Color.find();
    res.json(colors.map((c) => c.name));
  } catch {
    res.status(500).json({ message: "Colors авахад алдаа" });
  }
});

app.post("/api/colors", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Нэр шаардлагатай" });

    const exists = await Color.findOne({ name });
    if (exists) return res.status(400).json({ message: "Ийм өнгө байна" });

    const color = await new Color({ name }).save();
    res.status(201).json(color);
  } catch {
    res.status(500).json({ message: "Colors нэмэхэд алдаа" });
  }
});

// ======================
// Server
// ======================
app.listen(PORT, () => console.log(`Backend running on ${BACKEND_URL}`));
