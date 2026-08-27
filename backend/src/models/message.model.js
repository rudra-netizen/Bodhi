const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userQ",
      required: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatQ",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "image"],
      required: true,
      default: "text",
    },

    // What kind of AI/chat operation this message belongs to
    mode: {
      type: String,
      enum: ["chat", "image-understanding", "image-generation"],
      default: "chat",
    },

    role: {
      type: String,
      enum: ["user", "model", "system"],
      required: true,
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const messageModel = mongoose.model("messageQ", messageSchema);

module.exports = messageModel;
