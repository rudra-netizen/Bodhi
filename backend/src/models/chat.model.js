const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userQ",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const chatModel = mongoose.model("chatQ", chatSchema);

module.exports = chatModel;
