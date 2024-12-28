const Conversation = require('../models/conversation');
const Message = require('../models/messages');
const User = require('../models/user');

const handleStartConversation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        const existingConversation = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });
        if (existingConversation) {
            return res.status(400).json({ message: 'Conversation already exists' });
        }

        await Conversation.create({ members: [senderId, receiverId] });
        res.status(201).json({ message: 'Conversation created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating conversation!' });
    }
};

const handleLoadConversations = async (req, res) => {
    try {
        const userId = req.params.userId;
        const conversations = await Conversation.find({ members: { $in: [userId] } });

        const conversationList = await Promise.all(conversations.map(async (conversation) => {
            const receiverId = conversation.members.find(member => member !== userId);
            const user = await User.findById(receiverId);
            return { 
                user: { 
                    name: user?.name, 
                    email: user?.email, 
                    number: user?.number, 
                    userId: user?._id 
                }, 
                conversationId: conversation._id 
            };
        }));

        res.status(200).json(conversationList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error loading conversations!' });
    }
};

const handleCreateMessage = async (req, res) => {
    try {
        const { conversationId, senderId, message, receiverId = '' } = req.body;
        if (!senderId || !message) return res.status(400).json({ message: 'Please fill all required fields' });

        if (conversationId === 'new' && receiverId) {
            const newConversation = new Conversation({ members: [senderId, receiverId] });
            await newConversation.save();

            const newMessage = new Message({ conversationId: newConversation._id, senderId, message });
            await newMessage.save();

            return res.status(200).json({ message: 'Message sent successfully!' });
        } else if (!conversationId && !receiverId) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const newMessage = await Message.create({ conversationId, senderId, message });
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending message!' });
    }
};

const handleLoadMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;

        if (conversationId !== 'new') {
            const messages = await Message.find({ conversationId });

            if (messages.length > 0) {
                const messageUserData = await Promise.all(messages.map(async (message) => {
                    const user = await User.findById(message.senderId);
                    return { 
                        user: { 
                            userId: user._id, 
                            email: user.email, 
                            name: user.name, 
                            number: user.number 
                        }, 
                        message: message.message 
                    };
                }));

                return res.status(200).json(messageUserData);
            }
        } 
        res.status(200).json([]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error loading messages!' });
    }
};

module.exports = {
    handleStartConversation,
    handleLoadConversations,
    handleCreateMessage,
    handleLoadMessages
};
