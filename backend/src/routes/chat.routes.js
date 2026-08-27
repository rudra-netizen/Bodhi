const express = require("express");
const ChatController = require("../controllers/chat.controller");
const Middleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", Middleware.AuthMiddlew, ChatController.createChat);
router.get("/", Middleware.AuthMiddlew, ChatController.getChats);
router.get(
  "/:chatId/messages",
  Middleware.AuthMiddlew,
  ChatController.getChatMessages,
);
router.get("/:chatId", Middleware.AuthMiddlew, ChatController.getChat);
router.put("/:chatId", Middleware.AuthMiddlew, ChatController.updateChat);
router.delete("/:chatId", Middleware.AuthMiddlew, ChatController.deleteChat);

module.exports = router;
