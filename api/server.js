// lambda.js
const serverless = require("serverless-http");
const app = require("./app"); // path to your app.js
const mongoose = require("mongoose");
require("dotenv").config();

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Wrap your app in serverless once
const handler = serverless(app);

module.exports.handler = async (req, res) => {
  try {
    await connectDB();
    return handler(req, res); // call serverless handler
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
