const chatModel = require("../models/chat.model");
const messageModel = require("../models/message.model");

async function createChat(req, res) {
  const { title } = req.body;

  const chat = await chatModel.create({
    user: req.user,
    title: title,
    lastActivity: Date.now(),
  });

  return res.status(201).json({
    message: "User Chat created Successfully",
    chatId: chat._id,
  });
}

async function getChats(req, res) {
  try {
    const chats = await chatModel
      .find({ user: req.user })
      .sort({ lastActivity: -1 });

    return res.status(200).json({
      message: "Chats retrieved successfully",
      chats: chats,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving chats",
      error: error.message,
    });
  }
}

async function getChat(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized to access this chat",
      });
    }

    return res.status(200).json({
      message: "Chat retrieved successfully",
      chat: chat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving chat",
      error: error.message,
    });
  }
}

async function getChatMessages(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized to access this chat",
      });
    }

    const messages = await messageModel
      .find({ chat: chatId, user: req.user._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      message: "Chat messages retrieved successfully",
      messages: messages.map((message) => ({
        id: message._id,
        role: message.role,
        type: message.type,
        content: message.content,
        mode: message.mode,
        createdAt: message.createdAt,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving chat messages",
      error: error.message,
    });
  }
}

async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized to delete this chat",
      });
    }

    // delete chat and related messages for this user
    await chatModel.findByIdAndDelete(chatId);
    await messageModel.deleteMany({ chat: chatId, user: req.user._id });

    return res.status(200).json({
      message: "Chat deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting chat",
      error: error.message,
    });
  }
}

async function updateChat(req, res) {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    const chat = await chatModel.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized to update this chat",
      });
    }

    if (title) {
      chat.title = title;
    }

    chat.lastActivity = Date.now();
    await chat.save();

    return res.status(200).json({
      message: "Chat updated successfully",
      chat: chat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating chat",
      error: error.message,
    });
  }
}

module.exports = {
  createChat,
  getChats,
  getChat,
  getChatMessages,
  deleteChat,
  updateChat,
};
