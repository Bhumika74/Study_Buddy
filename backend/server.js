require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const sequelize = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth",authRoutes);
app.use("/api/ai",aiRoutes);
const studentRoutes = require("./routes/studentRoutes");
const educatorRoutes = require("./routes/educatorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/student",studentRoutes);
app.use("/api/educator",educatorRoutes);
app.use("/api/admin",adminRoutes);
app.use("/api/chat", chatRoutes);

// Store active socket connections
const userSockets = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // User joins with their ID
  socket.on("user-online", (userId) => {
    userSockets[userId] = socket.id;
    console.log(`User ${userId} online with socket ${socket.id}`);
    io.emit("user-status", { userId, status: "online" });
  });

  // Handle new messages in real-time
  socket.on("send-message", (data) => {
    const { senderId, receiverId, message, courseId } = data;
    
    // Send to receiver if online
    const receiverSocketId = userSockets[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        senderId,
        message,
        courseId,
        timestamp: new Date()
      });
    }
  });

  // Handle message deletion for current user
  socket.on("delete-message-me", (data) => {
    const { messageId, userId } = data;
    io.emit("message-deleted-me", { messageId, userId });
  });

  // Handle message deletion for everyone
  socket.on("delete-message-all", (data) => {
    const { messageId, senderId } = data;
    io.emit("message-deleted-all", { messageId, senderId });
  });

  // User goes offline
  socket.on("user-offline", (userId) => {
    delete userSockets[userId];
    console.log(`User ${userId} offline`);
    io.emit("user-status", { userId, status: "offline" });
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Find and remove user
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        io.emit("user-status", { userId, status: "offline" });
        break;
      }
    }
  });
});

sequelize.sync().then(()=>{

  server.listen(process.env.PORT,()=>{

    console.log("Server running on port",process.env.PORT);

  });

});