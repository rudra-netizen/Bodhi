const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the databse");
  } catch (err) {
    console.log("Error connecting to the databse", err);
  }
}

module.exports = connectDB;
