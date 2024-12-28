const express = require('express');
const { handleStartConversation, handleLoadConversations, handleCreateMessage, handleLoadMessages } = require('../controllers/chat');

const router = express.Router()

router.post('/conversation', handleStartConversation)
router.get('/conversation/:userId', handleLoadConversations)

router.post('/create-message', handleCreateMessage)
router.get('/load-messages/:conversationId', handleLoadMessages)


module.exports = router;