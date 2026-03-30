const express = require("express");
const router = express.Router();

const studentController = require("../controllers/studentController");
const auth = require("../middleware/authMiddleware");

router.get("/courses",auth,studentController.getCourses);

router.get("/progress",auth,studentController.getProgress);

module.exports = router;