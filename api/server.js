const serverless = require("serverless-http");
const app = require("../app");
const mongoose = require("mongoose");
require("dotenv").config();

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB Connected ✔");
}

module.exports = async (req, res) => {
  await connectDB();
  const handler = serverless(app);
  return handler(req, res);
};
