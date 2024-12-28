const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    messageType: { type: String, enum: ['text', 'image', 'video'], default: 'text' }, // Optional
    mediaUrl: { type: String } // Optional for images or videos
}, { timestamps: true });

// const messageSchema = new mongoose.Schema({
//     conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
//     senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     message: { type: String, required: true },
// }, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
