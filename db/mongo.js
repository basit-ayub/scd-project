const mongoose = require('mongoose');

async function connectDB() {
  const uri = "mongodb://localhost:27017/nodevault"; // hardcoded for Part 1

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

module.exports = connectDB;
