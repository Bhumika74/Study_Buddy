const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const chatController = require("../controllers/chatController");

// Get all doubts in a course (educator view)
router.get("/course/:courseId/doubts", auth, chatController.getCourseDoubts);

// Get doubts for a course (student view)
router.get("/course/:courseId/chat", auth, chatController.getCourseChat);

// Post a doubt in a course (students ask questions)
router.post("/course/:courseId/doubt", auth, chatController.postDoubt);

// Reply to a doubt
router.post("/message/:messageId/reply", auth, chatController.replyToDoubt);

// Delete message for current user
router.delete("/message/:messageId/delete-me", auth, chatController.deleteMessageForMe);

// Delete message for everyone
router.delete("/message/:messageId/delete-all", auth, chatController.deleteMessageForAll);

module.exports = router;
