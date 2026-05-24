const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const auth = require("../middleware/authMiddleware");

// Courses
router.get("/courses", auth, studentController.getCourses);
router.get("/courses/:courseId", auth, studentController.getCourseDetails);
router.post("/enroll", auth, studentController.enrollCourse);

// Progress
router.get("/progress", auth, studentController.getProgress);
router.get("/progress/:courseId", auth, studentController.getCourseProgress);
router.post("/submit-assignment", auth, studentController.submitAssignment);

// Profile
router.put("/profile", auth, studentController.updateProfile);

// Stats
router.get("/stats", auth, studentController.getStats);

// AI Chats
router.get("/ai-chats", auth, studentController.getAIChats);
router.post("/ai-chats", auth, studentController.createAIChat);
router.put("/ai-chats/:id", auth, studentController.updateAIChat);

module.exports = router;