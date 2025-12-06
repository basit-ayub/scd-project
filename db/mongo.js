require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI; // now using env file

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
}

module.exports = connectDB;
