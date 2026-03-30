const express = require("express");
const router = express.Router();

const educatorController = require("../controllers/educatorController");

router.post("/courses",educatorController.createCourse);

router.post("/assignments",educatorController.createAssignment);

module.exports = router;