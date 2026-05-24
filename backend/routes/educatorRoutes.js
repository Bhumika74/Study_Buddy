const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const educatorController = require("../controllers/educatorController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer storage to preserve original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Preserve original filename with extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Courses
router.get("/courses", auth, educatorController.getCourses);
router.post("/courses", auth, educatorController.createCourse);
router.put("/courses/:id", auth, educatorController.updateCourse);
router.delete("/courses/:id", auth, educatorController.deleteCourse);

// Assignments
router.get("/assignments", auth, educatorController.getAssignments);
router.post("/assignments", auth, upload.single("file"), educatorController.createAssignment);
router.put("/assignments/:id", auth, educatorController.updateAssignment);
router.delete("/assignments/:id", auth, educatorController.deleteAssignment);

// Materials
router.get("/materials", auth, educatorController.getMaterials);
router.post("/materials", auth, upload.single("file"), educatorController.uploadMaterial);
router.put("/materials/:id", auth, educatorController.updateMaterial);
router.delete("/materials/:id", auth, educatorController.deleteMaterial);

// Students & Progress
router.get("/students", auth, educatorController.getStudents);
router.get("/students/:id", auth, educatorController.getStudentDetails);
router.get("/progress/:courseId", auth, educatorController.getCourseProgress);
router.get("/progress/:courseId/:studentId", auth, educatorController.getStudentCourseProgress);
router.post("/progress/update", auth, educatorController.updateStudentProgress);
router.post("/progress/complete", auth, educatorController.completeStudentCourse);

// Statistics
router.get("/stats", auth, educatorController.getStats);

module.exports = router;