const express = require("express");
const {
  handleStartConversation,
  handleLoadConversations,
  handleCreateMessage,
  handleLoadMessages,
} = require("../controllers/chat.controller");
const verifyToken = require("../middleware/verifyToken");
const { createConversation, getConversationById, getUserConversations } = require("../controllers/conversation.controller");
const { sendMessage, getMessages } = require("../controllers/message.controller");

const router = express.Router();

router.post("/conversation", handleStartConversation);
router.get("/conversation/:userId", handleLoadConversations);

router.post("/create-message", handleCreateMessage);
router.get("/load-messages/:conversationId", handleLoadMessages);

// router.post('/create', verifyToken, createConversation);
// router.get('/:conversationId', verifyToken, getConversationById);
// router.get('/user/:userId', verifyToken, getUserConversations);

// // Messages
// router.post('/send', verifyToken, sendMessage);
// router.get('/messages/:conversationId', verifyToken, getMessages);

module.exports = router;
