import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Mongo once connection
if (!global.mongooseConnected) {
  mongoose.connect(process.env.MONGO_URI)
  global.mongooseConnected = true;
}

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.password !== password)
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token);
  res.json({ message: "Logged in" });
});

export default app;
