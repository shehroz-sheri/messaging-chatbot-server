require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectMongoDb = require("./db/connection");
const userRoutes = require("./routes/user.routes");
const chatRoutes = require("./routes/chat.routes");
const cors = require("cors");
const User = require("./models/user");
const http = require("http");
const verifyToken = require("./middleware/verifyToken");
const Message = require("./models/messages");
const Conversation = require("./models/conversation");
const { default: mongoose } = require("mongoose");
const app = express();

const BASE_URL = process.env.BASE_URL;

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: BASE_URL,
  },
});

const PORT = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// MongoDB Connection
connectMongoDb(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.error("MongoDB connection failed", err));

// Socket.IO
let users = [];
io.on("connection", (socket) => {
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    if (!isUserExist) {
      users.push({ userId, socketId: socket.id });
    } else {
      users = users.map((user) =>
        user.userId === userId ? { userId, socketId: socket.id } : user
      );
    }
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", async ({ senderId, receiverId, message, conversationId }) => {
    try {
      console.log({ senderId, receiverId, message, conversationId });
  
      // Check if sender exists
      const user = await User.findById(senderId);
      if (!user) {
        return io.to(socket.id).emit("error", { message: "Sender not found" });
      }
  
      // If no conversationId is provided, try to find an existing conversation between the sender and receiver
      if (!conversationId) {
        const existingConversation = await Conversation.findOne({
          members: { $all: [senderId, receiverId] }
        });
  
        // If an existing conversation is found, use it
        if (existingConversation) {
          conversationId = existingConversation._id;
        } else {
          // If no existing conversation is found, create a new one
          const newConversation = new Conversation({
            members: [senderId, receiverId],
          });
          const conversationRes = await newConversation.save();
          conversationId = conversationRes._id;
        }
      }
  
      // Ensure the conversation exists in the database
      let conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        const newConversation = new Conversation({
          members: [senderId, receiverId],
        });
        const conversationRes = await newConversation.save();
        conversationId = conversationRes._id;
      }
  
      // Create and save the new message
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        conversationId,
      });
      await newMessage.save();
  
      // Get the receiver's and sender's socket information
      const receiver = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
  
      const payload = {
        senderId,
        receiverId,
        message,
        conversationId,
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
          number: user.number,
        },
      };
  
      // Send the message to both sender and receiver (if receiver is online)
      if (receiver) {
        io.to(receiver.socketId).to(sender.socketId).emit("getMessage", payload);
      } else {
        io.to(sender.socketId).emit("getMessage", payload);
      }
    } catch (error) {
      console.error("Error handling sendMessage:", error);
      io.to(socket.id).emit("error", { message: "Internal server error" });
    }
  });
  

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

// Routes
app.get("/", (req, res) => {
  res.cookie("jwt", "This is cookie");
  return res.json({ message: "Hello world" });
});

app.use("/user", userRoutes);
app.use("/chat", verifyToken, chatRoutes);

// Server Listener
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
