const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Home = Register page
router.get("/", (req, res) => {
  console.log("GET / → redirect to /register");
  res.redirect("/register");
});

// GET register page
router.get("/register", (req, res) => {
  console.log("GET /register");
  res.render("register", { error: null });
});

// POST register
router.post("/register", async (req, res) => {
  console.log("POST /register body:", req.body);
  try {
    const { name, email, password } = req.body;
    const exist = await User.findOne({ email });
    console.log("User exists:", exist);

    if (exist) return res.render("register", { error: "Email already exists" });

    const hashed = await bcrypt.hash(password.trim(), 10);
    console.log("Password hashed:", hashed);

    const newUser = await User.create({ name, email, password: hashed });
    console.log("User created:", newUser);

    res.redirect("/login");
  } catch (err) {
    console.error("Register error:", err);
    res.render("register", { error: "Something went wrong" });
  }
});

// GET login page
router.get("/login", (req, res) => {
  console.log("GET /login");
  res.render("login", { error: null });
});

// POST login
router.post("/login", async (req, res) => {
  console.log("POST /login body:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("User found:", user);

    if (!user) return res.render("login", { error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password.trim(), user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) return res.render("login", { error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    console.log("JWT created:", token);

    res.cookie("token", token, { httpOnly: true, path: "/" });
    console.log("Cookie set, redirecting to /todos");
    res.redirect("/todos");
  } catch (err) {
    console.error("Login error:", err);
    res.render("login", { error: "Something went wrong" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  console.log("GET /logout → clearing cookie");
  res.clearCookie("token", { path: "/" });
  res.redirect("/login");
});

module.exports = router;
