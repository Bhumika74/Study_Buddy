const express = require("express");
const router = express.Router();
const multer = require("multer");

const aiController = require("../controllers/aiController");

const upload = multer({ dest: "uploads/" });

router.post("/chat", aiController.chat);

router.post("/analyze", aiController.analyzeMaterial);

router.post("/quiz", aiController.generateQuiz);
router.post("/ask-pdf", aiController.askPDF);
router.post(
  "/upload-material",
  upload.single("file"),
  aiController.uploadMaterial
);

module.exports = router;